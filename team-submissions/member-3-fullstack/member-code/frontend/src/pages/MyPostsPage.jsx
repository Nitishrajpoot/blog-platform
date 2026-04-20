import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deletePost, myPosts } from "../lib/api";

export default function MyPostsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await myPosts();
      setItems(data.items);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load your posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const published = items.filter((p) => p.published).length;
    return { total: items.length, published, drafts: items.length - published };
  }, [items]);

  async function onDelete(id) {
    if (!confirm("Delete this post?")) return;
    setBusyId(id);
    try {
      await deletePost(id);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My posts</h1>
          <p className="mt-1 text-sm text-slate-300">
            Total: {stats.total} • Published: {stats.published} • Drafts: {stats.drafts}
          </p>
        </div>
        <Link
          to="/me/posts/new"
          className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
        >
          + New post
        </Link>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading…</div>
      ) : error ? (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
          You haven’t written anything yet.
        </div>
      ) : (
        <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {items.map((p) => (
            <div key={p._id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-white">{p.title}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.published ? "bg-emerald-400/20 text-emerald-200" : "bg-amber-400/20 text-amber-200"
                    }`}
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">{new Date(p.updatedAt).toLocaleString()}</div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
                  to={`/me/posts/${p._id}/edit`}
                >
                  Edit
                </Link>
                <button
                  disabled={busyId === p._id}
                  className="rounded-lg bg-red-500/15 px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-500/25 disabled:opacity-60"
                  onClick={() => onDelete(p._id)}
                >
                  {busyId === p._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

