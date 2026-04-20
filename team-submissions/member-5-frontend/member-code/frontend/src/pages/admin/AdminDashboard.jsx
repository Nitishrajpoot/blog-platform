import { useEffect, useState } from "react";
import { adminPosts, adminUsers, deletePost, deleteUser, setUserRole } from "../../lib/api";

export default function AdminDashboard() {
  const [tab, setTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [p, u] = await Promise.all([adminPosts(), adminUsers()]);
      setPosts(p.items);
      setUsers(u.items);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDeletePost(id) {
    if (!confirm("Delete this post?")) return;
    await deletePost(id);
    await load();
  }

  async function onToggleRole(u) {
    const next = u.role === "admin" ? "user" : "admin";
    if (!confirm(`Set ${u.email} role to ${next}?`)) return;
    await setUserRole(u._id, next);
    await load();
  }

  async function onDeleteUser(u) {
    if (!confirm(`Delete user ${u.email}?`)) return;
    await deleteUser(u._id);
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin panel</h1>
        <p className="mt-1 text-sm text-slate-300">Manage users and content.</p>
      </div>

      <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => setTab("posts")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            tab === "posts" ? "bg-white text-slate-950" : "text-slate-200 hover:bg-white/10"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setTab("users")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            tab === "users" ? "bg-white text-slate-950" : "text-slate-200 hover:bg-white/10"
          }`}
        >
          Users
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading…</div>
      ) : error ? (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</div>
      ) : tab === "posts" ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-12 gap-2 border-b border-white/10 px-5 py-3 text-xs font-semibold text-slate-400">
            <div className="col-span-6">Title</div>
            <div className="col-span-3">Author</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {posts.map((p) => (
            <div key={p._id} className="grid grid-cols-12 gap-2 px-5 py-3 text-sm">
              <div className="col-span-6 truncate font-medium text-white">{p.title}</div>
              <div className="col-span-3 truncate text-slate-300">{p.author?.name || "—"}</div>
              <div className="col-span-1 text-slate-300">{p.published ? "Pub" : "Draft"}</div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => onDeletePost(p._id)}
                  className="rounded-lg bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/25"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-12 gap-2 border-b border-white/10 px-5 py-3 text-xs font-semibold text-slate-400">
            <div className="col-span-4">Name</div>
            <div className="col-span-5">Email</div>
            <div className="col-span-1">Role</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {users.map((u) => (
            <div key={u._id} className="grid grid-cols-12 gap-2 px-5 py-3 text-sm">
              <div className="col-span-4 truncate font-medium text-white">{u.name}</div>
              <div className="col-span-5 truncate text-slate-300">{u.email}</div>
              <div className="col-span-1 text-slate-300">{u.role}</div>
              <div className="col-span-2 flex justify-end gap-2">
                <button
                  onClick={() => onToggleRole(u)}
                  className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                >
                  Toggle role
                </button>
                <button
                  onClick={() => onDeleteUser(u)}
                  className="rounded-lg bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/25"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

