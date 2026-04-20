const express = require("express");
const { z } = require("zod");

const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { requireAuth, optionalAuth, requireAdmin } = require("../middleware/auth");
const { HttpError } = require("../utils/httpError");
const { slugify } = require("../utils/slugify");

const router = express.Router();

const CreatePostSchema = z.object({
  title: z.string().min(3).max(180),
  excerpt: z.string().max(400).optional().default(""),
  content: z.string().min(1),
  coverImageUrl: z.string().url().optional().or(z.literal("")).default(""),
  published: z.boolean().optional().default(true),
});

const UpdatePostSchema = CreatePostSchema.partial();

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
    const skip = (page - 1) * limit;

    const filter = { published: true };
    const [items, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("title slug excerpt coverImageUrl published author likedBy createdAt updatedAt")
        .lean(),
      Post.countDocuments(filter),
    ]);

    const meId = req.user?._id?.toString() || "";
    const shaped = items.map((p) => ({
      ...p,
      likesCount: (p.likedBy || []).length,
      likedByMe: meId ? (p.likedBy || []).some((id) => id.toString() === meId) : false,
      likedBy: undefined,
    }));

    res.json({ items: shaped, page, limit, total });
  } catch (err) {
    next(err);
  }
});

router.get("/admin", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const items = await Post.find({})
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .select("title slug excerpt published author createdAt updatedAt");
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const items = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .select("title slug excerpt published createdAt updatedAt");
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.get("/id/:id", requireAuth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");
    if (!post) throw new HttpError(404, "Post not found");
    if (req.user.role !== "admin" && post.author._id.toString() !== req.user._id.toString()) {
      throw new HttpError(403, "Forbidden");
    }
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", optionalAuth, async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true })
      .populate("author", "name")
      .select("title slug excerpt content coverImageUrl published author likedBy createdAt updatedAt")
      .lean();
    if (!post) throw new HttpError(404, "Post not found");

    const meId = req.user?._id?.toString() || "";
    res.json({
      post: {
        ...post,
        likesCount: (post.likedBy || []).length,
        likedByMe: meId ? (post.likedBy || []).some((id) => id.toString() === meId) : false,
        likedBy: undefined,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:slug/like", requireAuth, async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true });
    if (!post) throw new HttpError(404, "Post not found");

    const meId = req.user._id.toString();
    const already = (post.likedBy || []).some((id) => id.toString() === meId);
    if (!already) {
      post.likedBy = [...(post.likedBy || []), req.user._id];
      await post.save();
    }

    res.json({ ok: true, likesCount: post.likedBy.length });
  } catch (err) {
    next(err);
  }
});

router.delete("/:slug/like", requireAuth, async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true });
    if (!post) throw new HttpError(404, "Post not found");

    const meId = req.user._id.toString();
    post.likedBy = (post.likedBy || []).filter((id) => id.toString() !== meId);
    await post.save();

    res.json({ ok: true, likesCount: post.likedBy.length });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug/comments", async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true }).select("_id");
    if (!post) throw new HttpError(404, "Post not found");

    const items = await Comment.find({ post: post._id })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .select("content author createdAt");

    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.post("/:slug/comments", requireAuth, async (req, res, next) => {
  try {
    const ContentSchema = z.object({ content: z.string().min(1).max(2000) });
    const parsed = ContentSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Invalid input", parsed.error.flatten());

    const post = await Post.findOne({ slug: req.params.slug, published: true }).select("_id");
    if (!post) throw new HttpError(404, "Post not found");

    const created = await Comment.create({
      post: post._id,
      author: req.user._id,
      content: parsed.data.content,
    });

    const populated = await Comment.findById(created._id).populate("author", "name").select("content author createdAt");
    res.status(201).json({ comment: populated });
  } catch (err) {
    next(err);
  }
});

router.delete("/comments/:id", requireAuth, async (req, res, next) => {
  try {
    const c = await Comment.findById(req.params.id);
    if (!c) throw new HttpError(404, "Comment not found");
    if (req.user.role !== "admin" && c.author.toString() !== req.user._id.toString()) {
      throw new HttpError(403, "Forbidden");
    }
    await c.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const parsed = CreatePostSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Invalid input", parsed.error.flatten());

    const { title, excerpt, content, coverImageUrl, published } = parsed.data;
    const base = slugify(title);
    if (!base) throw new HttpError(400, "Invalid title");

    let slug = base;
    for (let i = 0; i < 10; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const exists = await Post.findOne({ slug }).select("_id");
      if (!exists) break;
      slug = `${base}-${Math.random().toString(36).slice(2, 7)}`;
    }

    const post = await Post.create({
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
      published,
      author: req.user._id,
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const parsed = UpdatePostSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Invalid input", parsed.error.flatten());

    const post = await Post.findById(req.params.id);
    if (!post) throw new HttpError(404, "Post not found");
    if (req.user.role !== "admin" && post.author.toString() !== req.user._id.toString()) {
      throw new HttpError(403, "Forbidden");
    }

    const patch = parsed.data;
    if (typeof patch.title === "string" && patch.title !== post.title) {
      const base = slugify(patch.title);
      if (base) post.slug = `${base}-${post._id.toString().slice(-6)}`;
      post.title = patch.title;
    }
    if (typeof patch.excerpt === "string") post.excerpt = patch.excerpt;
    if (typeof patch.content === "string") post.content = patch.content;
    if (typeof patch.coverImageUrl === "string") post.coverImageUrl = patch.coverImageUrl;
    if (typeof patch.published === "boolean") post.published = patch.published;

    await post.save();
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new HttpError(404, "Post not found");
    if (req.user.role !== "admin" && post.author.toString() !== req.user._id.toString()) {
      throw new HttpError(403, "Forbidden");
    }
    await post.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

