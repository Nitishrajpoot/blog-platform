const express = require("express");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const { requireAuth } = require("../middleware/auth");
const { HttpError } = require("../utils/httpError");

const router = express.Router();

const uploadRoot = path.join(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadRoot);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const name = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext || ".bin"}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!/^image\/(png|jpe?g|gif|webp)$/i.test(file.mimetype || "")) {
      return cb(new HttpError(400, "Only image uploads are allowed (png, jpg, gif, webp)."));
    }
    cb(null, true);
  },
});

router.post("/image", requireAuth, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) throw new HttpError(400, "Missing image file");
    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(201).json({ url });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

