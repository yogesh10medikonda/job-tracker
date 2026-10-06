const express = require("express");
const auth = require("../middleware/auth");
const { sendDueReminders } = require("../services/reminderService");

const router = express.Router();

router.post("/run", auth, async (req, res) => {
  try {
    const { sent, failed } = await sendDueReminders(req.userId);
    if (failed) return res.status(502).json({ message: "Email sending failed, check server logs", sent, failed });
    res.json({ message: sent ? `Reminder sent for ${sent} application(s)` : "No reminders due", sent });
  } catch (err) {
    res.status(500).json({ message: "Could not send reminders" });
  }
});

module.exports = router;