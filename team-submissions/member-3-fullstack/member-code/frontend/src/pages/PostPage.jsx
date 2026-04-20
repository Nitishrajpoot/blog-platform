import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { addComment, deleteComment, getPost, likePost, listComments, unlikePost } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

export default function PostPage() {
  const { slug } = useParams();
  const auth = useAuth();
  const [state, setState] = useState({ loading: true, post: null, error: "" });
  const [commentsState, setCommentsState] = useState({ loading: true, items: [], error: "" });
  const [commentText, setCommentText] = useState("");
  const [busy, setBusy] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    let alive = true;
    getPost(slug)
      .then((data) => {
        if (!alive) return;
        setState({ loading: false, post: data.post, error: "" });
      })
      .catch((e) => {
        if (!alive) return;
        setState({ loading: false, post: null, error: e?.response?.data?.message || "Failed to load post" });
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  async function loadComments() {
    setCommentsState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await listComments(slug);
      setCommentsState({ loading: false, items: data.items || [], error: "" });
    } catch (e) {
      setCommentsState({
        loading: false,
        items: [],
        error: e?.response?.data?.message || "Failed to load comments",
      });
    }
  }

  useEffect(() => {
    loadComments();
  }, [slug]);

  const canComment = !!auth.user;
  const canDelete = useMemo(() => {
    return (commentAuthorId) => auth.user?.role === "admin" || auth.user?._id === commentAuthorId;
  }, [auth.user]);

  async function onSubmitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setBusy(true);
    try {
      await addComment(slug, commentText.trim());
      setCommentText("");
      await loadComments();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to post comment");
    } finally {
      setBusy(false);
    }
  }

  async function onDeleteComment(id) {
    if (!confirm("Delete this comment?")) return;
    setBusy(true);
    try {
      await deleteComment(id);
      await loadComments();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggleLike() {
    if (!auth.user) {
      alert("Login to like posts.");
      return;
    }
    if (!state.post) return;
    setLiking(true);
    try {
      if (state.post.likedByMe) await unlikePost(slug);
      else await likePost(slug);
      const data = await getPost(slug);
      setState({ loading: false, post: data.post, error: "" });
    } catch (e) {
      alert(e?.response?.data?.message || "Like failed");
    } finally {
      setLiking(false);
    }
  }

  if (state.loading) return <div className="text-slate-400">Loading…</div>;
  if (state.error)
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{state.error}</div>
        <Link className="text-cyan-300 hover:underline" to="/">
          ← Back
        </Link>
      </div>
    );

  const p = state.post;
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{p.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span>By {p.author?.name || "Unknown"}</span>
          <span>•</span>
          <span>{new Date(p.createdAt).toLocaleString()}</span>
          <span>•</span>
          <button
            disabled={liking}
            onClick={toggleLike}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              p.likedByMe ? "bg-pink-500/20 text-pink-200 hover:bg-pink-500/30" : "bg-white/10 text-slate-200 hover:bg-white/15"
            } disabled:opacity-60`}
          >
            {p.likedByMe ? "Liked" : "Like"} • {p.likesCount ?? 0}
          </button>
        </div>
      </header>

      {p.coverImageUrl ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <img src={p.coverImageUrl} alt="" className="h-auto w-full object-cover" loading="lazy" />
        </div>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="prose prose-invert max-w-none prose-a:text-cyan-300 prose-img:rounded-xl prose-img:border prose-img:border-white/10">
          <ReactMarkdown>{p.content || ""}</ReactMarkdown>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Comments</h2>
          {commentsState.loading ? <span className="text-sm text-slate-400">Loading…</span> : null}
        </div>

        {commentsState.error ? (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{commentsState.error}</div>
        ) : null}

        {canComment ? (
          <form onSubmit={onSubmitComment} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <textarea
              className="h-24 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none ring-cyan-400/30 focus:ring-2"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment…"
              maxLength={2000}
            />
            <div className="flex items-center justify-end">
              <button
                disabled={busy}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90 disabled:opacity-60"
              >
                {busy ? "Posting…" : "Post comment"}
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Login to comment.
          </div>
        )}

        {!commentsState.loading && commentsState.items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">No comments yet.</div>
        ) : (
          <div className="space-y-3">
            {commentsState.items.map((c) => (
              <div key={c._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm text-slate-300">
                      <span className="font-semibold text-white">{c.author?.name || "Unknown"}</span>{" "}
                      <span className="text-slate-500">• {new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-slate-200">{c.content}</p>
                  </div>
                  {canDelete(c.author?._id) ? (
                    <button
                      disabled={busy}
                      onClick={() => onDeleteComment(c._id)}
                      className="shrink-0 rounded-lg bg-red-500/15 px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-500/25 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Link className="text-cyan-300 hover:underline" to="/">
        ← Back to posts
      </Link>
    </article>
  );
}

