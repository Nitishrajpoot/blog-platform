import { useAuth } from "../lib/auth.jsx";
import { useEffect, useState } from "react";
import { listPublicUsers, followUser, unfollowUser, me as apiMe } from "../lib/api";

export default function ProfilePage() {
  const auth = useAuth();
  const u = auth.user;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refreshMe() {
    try {
      const data = await apiMe();
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch {
      // ignore
    }
  }

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await listPublicUsers("", 10);
      setUsers((data.items || []).filter((x) => x._id !== u?._id));
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function toggleFollow(target) {
    try {
      if (target.isFollowing) await unfollowUser(target._id);
      else await followUser(target._id);
      await loadUsers();
      await refreshMe();
    } catch (e) {
      alert(e?.response?.data?.message || "Action failed");
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-1 text-sm text-slate-300">Your account details.</p>

        <div className="mt-6 grid gap-3 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
            <span className="text-slate-400">Name</span>
            <span className="font-medium text-white">{u?.name}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
            <span className="text-slate-400">Email</span>
            <span className="font-medium text-white">{u?.email}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
            <span className="text-slate-400">Role</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
              {u?.role}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
              <span className="text-slate-400">Followers</span>
              <span className="font-medium text-white">{u?.followersCount ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
              <span className="text-slate-400">Following</span>
              <span className="font-medium text-white">{u?.followingCount ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Find people</h2>
            <p className="mt-1 text-sm text-slate-300">Follow other users.</p>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 text-slate-400">Loading…</div>
        ) : error ? (
          <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</div>
        ) : users.length === 0 ? (
          <div className="mt-4 text-sm text-slate-300">No users to show.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {users.map((x) => (
              <div key={x._id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate font-medium text-white">{x.name}</div>
                  <div className="truncate text-xs text-slate-400">{x.email}</div>
                </div>
                <button
                  onClick={() => toggleFollow(x)}
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${
                    x.isFollowing ? "bg-white/10 text-white hover:bg-white/15" : "bg-white text-slate-950 hover:bg-white/90"
                  }`}
                >
                  {x.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

