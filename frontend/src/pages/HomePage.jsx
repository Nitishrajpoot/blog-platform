import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { listPosts } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

export default function HomePage() {
  const auth = useAuth();
  const [state, setState] = useState({ loading: true, items: [], error: "" });

  useEffect(() => {
    let alive = true;
    listPosts(1, 12)
      .then((data) => {
        if (!alive) return;
        setState({ loading: false, items: data.items, error: "" });
      })
      .catch((e) => {
        if (!alive) return;
        setState({ loading: false, items: [], error: e?.response?.data?.message || "Failed to load posts" });
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Write. Publish. Manage.</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          A full blogging platform with authentication, user roles, and an admin panel.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold">Latest posts</h2>
        </div>

        {state.loading ? (
          <div className="text-slate-400">Loading…</div>
        ) : state.error ? (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{state.error}</div>
        ) : state.items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
            <div className="font-semibold text-white">No posts yet.</div>
            <div className="mt-1 text-sm text-slate-300">
              {auth.user ? "Create the first post from your dashboard." : "Login to start writing."}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {auth.user ? (
                <Link
                  to="/me/posts/new"
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
                >
                  + New post
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {state.items.map((p) => (
              <Link
                key={p._id}
                to={`/post/${p.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white group-hover:text-white">{p.title}</h3>
                  <span className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-300">{p.excerpt || "—"}</p>
                <div className="mt-4 text-sm font-medium text-cyan-300">Read →</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

