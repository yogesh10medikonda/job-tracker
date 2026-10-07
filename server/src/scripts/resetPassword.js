require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const [email, newPassword] = process.argv.slice(2);

(async () => {
  if (!email || !newPassword || newPassword.length < 6) {
    console.log("Usage: node src/scripts/resetPassword.js <email> <newPassword (6+ chars)>");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    console.log("No user with that email in this database.");
    process.exit(1);
  }
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  console.log("Password updated for", user.email);
  process.exit(0);
})();