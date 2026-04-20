const bcrypt = require("bcryptjs");
const User = require("../src/models/User");
const { connectDb } = require("../src/utils/db");
const { env } = require("../src/utils/env");

async function run() {
  await connectDb(env.MONGODB_URI);

  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin12345";
  const name = process.env.ADMIN_NAME || "Admin";

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = "admin";
    await existing.save();
    console.log(`Updated existing user to admin: ${email}`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name, email, passwordHash, role: "admin" });
  console.log(`Created admin user: ${email} / ${password}`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

