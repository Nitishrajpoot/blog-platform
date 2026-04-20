import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createPost, getPostById, updatePost } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

export default function EditorPage({ mode }) {
  const auth = useAuth();
  const nav = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(mode === "edit");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [coverImageUrl, setCoverImageUrl] = useState("");

  useEffect(() => {
    if (mode !== "edit") return;
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getPostById(id);
        const found = data.post;
        setTitle(found.title || "");
        setExcerpt(found.excerpt || "");
        setContent(found.content || "");
        setPublished(!!found.published);
        setCoverImageUrl(found.coverImageUrl || "");
      } catch (e) {
        if (!alive) return;
        setError(e?.response?.data?.message || e.message || "Failed to load post");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [mode, id, auth.isAdmin]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "create") {
        await createPost({ title, excerpt, content, published, coverImageUrl });
      } else {
        await updatePost(id, { title, excerpt, content, published, coverImageUrl });
      }
      nav("/me/posts");
    } catch (err) {
      setError(err?.response?.data?.message || "Save failed");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{mode === "create" ? "Create post" : "Edit post"}</h1>
          <p className="mt-1 text-sm text-slate-300">Write content and publish when ready.</p>
        </div>
        <Link className="text-cyan-300 hover:underline" to="/me/posts">
          ← Back
        </Link>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading…</div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          {error && (
            <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-300">Title</span>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none ring-cyan-400/30 focus:ring-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">Excerpt</span>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none ring-cyan-400/30 focus:ring-2"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={400}
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">Cover image URL (optional)</span>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none ring-cyan-400/30 focus:ring-2"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://…"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">Content</span>
              <textarea
                className="mt-1 h-64 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none ring-cyan-400/30 focus:ring-2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required={mode === "create"}
                placeholder="Write your blog content…"
              />
              {mode === "edit" && (
                <p className="mt-2 text-xs text-slate-400">
                  Tip: If you didn’t load existing content, paste it again here and save.
                </p>
              )}
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Published
            </label>

            <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90">
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

