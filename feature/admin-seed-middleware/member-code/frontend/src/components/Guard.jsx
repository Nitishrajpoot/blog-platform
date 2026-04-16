import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";

export function RequireAuth() {
  const auth = useAuth();
  const loc = useLocation();
  if (!auth.ready) return null;
  if (!auth.user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <Outlet />;
}

export function RequireAdmin() {
  const auth = useAuth();
  if (!auth.ready) return null;
  if (!auth.user) return <Navigate to="/login" replace />;
  if (!auth.isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}

