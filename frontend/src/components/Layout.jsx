import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Layout() {
  const auth = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-fuchsia-500 to-cyan-400 text-slate-950">
              B
            </span>
            <span>Blogging Platform</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-1 px-2 md:px-0">
            <NavItem to="/">Blogs</NavItem>
            {auth.user && <NavItem to="/me/posts">My posts</NavItem>}
            {auth.user && <NavItem to="/profile">Profile</NavItem>}
            {auth.isAdmin && <NavItem to="/admin">Admin</NavItem>}
          </nav>

          <div className="flex items-center gap-2">
            {!auth.user ? (
              <>
                <Link
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
                  to="/register"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <span className="hidden text-sm text-slate-300 md:block">{auth.user.email}</span>
                <button
                  onClick={() => auth.logout()}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-slate-400">
          Built with Node.js, Express, MongoDB, and React.
        </div>
      </footer>
    </div>
  );
}

