const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  console.log(
    "MONGO_URI length:",
    uri ? uri.length : 0,
    "starts with:",
    JSON.stringify((uri || "").slice(0, 14))
  );

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;