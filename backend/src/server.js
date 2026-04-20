const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const { env, corsOrigins } = require("./utils/env");
const { connectDb } = require("./utils/db");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");
const uploadRoutes = require("./routes/upload.routes");

async function main() {
  await connectDb(env.MONGODB_URI);

  const app = express();
  const isProd = env.NODE_ENV === "production";

  app.use(
    cors({
      origin(origin, cb) {
        // allow non-browser clients / same-origin
        if (!origin) return cb(null, true);
        // dev-friendly: allow any localhost port (dev only)
        if (!isProd && /^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
        if (!isProd && /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return cb(null, true);
        if (corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(morgan("dev"));

  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/uploads", uploadRoutes);

  app.use(notFound);
  app.use(errorHandler);

  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

