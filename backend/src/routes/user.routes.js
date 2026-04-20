const express = require("express");
const { z } = require("zod");
const User = require("../models/User");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { HttpError } = require("../utils/httpError");

const router = express.Router();

router.get("/", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select("_id name email role createdAt");
    res.json({ items: users });
  } catch (err) {
    next(err);
  }
});

router.get("/public", requireAuth, async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    const limit = Math.min(30, Math.max(1, Number(req.query.limit || 20)));
    const filter = q
      ? {
          $or: [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }],
        }
      : {};

    const users = await User.find(filter).sort({ createdAt: -1 }).limit(limit).select("_id name email followers following");
    const items = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      followersCount: u.followers?.length || 0,
      followingCount: u.following?.length || 0,
      isFollowing: (u.followers || []).some((id) => id.toString() === req.user._id.toString()),
    }));
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).select("_id name email followers following createdAt");
    if (!u) throw new HttpError(404, "User not found");

    res.json({
      user: {
        _id: u._id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        followersCount: u.followers?.length || 0,
        followingCount: u.following?.length || 0,
        isFollowing: (u.followers || []).some((id) => id.toString() === req.user._id.toString()),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/follow", requireAuth, async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) throw new HttpError(400, "You cannot follow yourself");
    const target = await User.findById(req.params.id);
    if (!target) throw new HttpError(404, "User not found");

    const me = await User.findById(req.user._id);
    if (!me) throw new HttpError(401, "Unauthorized");

    const already = (me.following || []).some((id) => id.toString() === target._id.toString());
    if (!already) {
      me.following = [...(me.following || []), target._id];
      target.followers = [...(target.followers || []), me._id];
      await Promise.all([me.save(), target.save()]);
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/follow", requireAuth, async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) throw new HttpError(400, "You cannot unfollow yourself");
    const target = await User.findById(req.params.id);
    if (!target) throw new HttpError(404, "User not found");

    const me = await User.findById(req.user._id);
    if (!me) throw new HttpError(401, "Unauthorized");

    me.following = (me.following || []).filter((id) => id.toString() !== target._id.toString());
    target.followers = (target.followers || []).filter((id) => id.toString() !== me._id.toString());
    await Promise.all([me.save(), target.save()]);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/role", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const RoleSchema = z.object({ role: z.enum(["user", "admin"]) });
    const parsed = RoleSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Invalid input", parsed.error.flatten());

    const user = await User.findById(req.params.id);
    if (!user) throw new HttpError(404, "User not found");
    user.role = parsed.data.role;
    await user.save();

    res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) throw new HttpError(400, "You cannot delete yourself");
    const user = await User.findById(req.params.id);
    if (!user) throw new HttpError(404, "User not found");
    await user.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

