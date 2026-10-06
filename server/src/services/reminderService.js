const Application = require("../models/Application");
const User = require("../models/User");
const { sendMail } = require("../utils/mailer");

const ACTIVE = ["applied", "oa", "interview"];
const fmt = (d) => new Date(d).toLocaleDateString("en-GB");

async function sendDueReminders(onlyUserId = null) {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const filter = {
    followUpDate: { $ne: null, $lte: endOfToday },
    reminderSentAt: null,
    status: { $in: ACTIVE },
  };
  if (onlyUserId) filter.userId = onlyUserId;

  const due = await Application.find(filter);
  const byUser = new Map();
  for (const a of due) {
    const key = String(a.userId);
    if (!byUser.has(key)) byUser.set(key, []);
    byUser.get(key).push(a);
  }

  let sent = 0;
  let failed = 0;
  for (const [userId, apps] of byUser) {
    const user = await User.findById(userId).select("name email");
    if (!user) continue;

    const lines = apps.map(
      (a) => `- ${a.company} - ${a.role} (${a.status}), follow-up date: ${fmt(a.followUpDate)}`
    );
    const text = `Hi ${user.name},

These applications need a follow-up:

${lines.join("\n")}

Open your Job Tracker dashboard to see ready-made follow-up drafts.
`;

    try {
      await sendMail({
        to: user.email,
        subject: `Job Tracker: ${apps.length} follow-up${apps.length > 1 ? "s" : ""} due`,
        text,
      });
      await Application.updateMany(
        { _id: { $in: apps.map((a) => a._id) } },
        { reminderSentAt: new Date() }
      );
      sent += apps.length;
    } catch (err) {
      console.error(`Reminder email failed for user ${userId}:`, err.message);
      failed += apps.length;
    }
  }
  return { sent, failed };
}

module.exports = { sendDueReminders };