const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { env } = require("../utils/env");
const { HttpError } = require("../utils/httpError");

async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new HttpError(401, "Unauthorized");

    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("_id name email role followers following");
    if (!user) throw new HttpError(401, "Unauthorized");

    req.user = user;
    next();
  } catch (err) {
    next(new HttpError(401, "Unauthorized"));
  }
}

async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return next();

    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("_id name email role followers following");
    if (user) req.user = user;
    return next();
  } catch {
    return next();
  }
}

function requireAdmin(req, _res, next) {
  if (!req.user) return next(new HttpError(401, "Unauthorized"));
  if (req.user.role !== "admin") return next(new HttpError(403, "Forbidden"));
  return next();
}

module.exports = { requireAuth, optionalAuth, requireAdmin };

