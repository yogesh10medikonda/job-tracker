require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cron = require("node-cron");
const { sendDueReminders } = require("./services/reminderService");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const applicationRoutes = require("./routes/applicationRoutes");
app.use("/applications", applicationRoutes);

const reminderRoutes = require("./routes/reminderRoutes");
app.use("/reminders", reminderRoutes);

const statsRoutes = require("./routes/statsRoutes");
app.use("/stats", statsRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // every day at 9:00 AM India time (change the timezone if you like)
  cron.schedule(
    "0 9 * * *",
    () => {
      sendDueReminders().catch((e) => console.error("Reminder job error:", e.message));
    },
    { timezone: "Asia/Kolkata" }
  );
});