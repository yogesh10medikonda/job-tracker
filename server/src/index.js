require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
const connectDB = require("./config/db");
const { sendDueReminders } = require("./services/reminderService");

const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const statsRoutes = require("./routes/statsRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

const app = express();

app.set("trust proxy", 1); // needed behind Render's proxy
app.use(helmet());

const origins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());
app.use(cors({ origin: origins }));

app.use("/auth", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/applications", applicationRoutes);
app.use("/stats", statsRoutes);
app.use("/reminders", reminderRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // every day at 9:00 AM India time
  cron.schedule(
    "0 9 * * *",
    () => {
      sendDueReminders().catch((e) => console.error("Reminder job error:", e.message));
    },
    { timezone: "Asia/Kolkata" }
  );
});