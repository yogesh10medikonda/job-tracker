const Application = require("../models/Application");
const { STATUSES } = require("../models/Application");

const startOfWeek = (d) => {
  const date = new Date(d);
  const dayFromMonday = (date.getDay() + 6) % 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - dayFromMonday);
  return date;
};

exports.getStats = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.userId }).select("status appliedDate");

    const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    apps.forEach((a) => { byStatus[a.status]++; });

    const total = apps.length;
    const applied = total - byStatus.wishlist;
    const responded = byStatus.oa + byStatus.interview + byStatus.offer + byStatus.rejected;
    const responseRate = applied ? Math.round((responded / applied) * 100) : 0;

    const thisWeek = startOfWeek(new Date());
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(thisWeek);
      start.setDate(start.getDate() - i * 7);
      weeks.push({ start, count: 0 });
    }
    apps.forEach((a) => {
      if (!a.appliedDate) return;
      const slot = weeks.find((w) => w.start.getTime() === startOfWeek(a.appliedDate).getTime());
      if (slot) slot.count++;
    });

    res.json({
      total,
      applied,
      responseRate,
      byStatus,
      weekly: weeks.map((w) => ({
        week: w.start.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        count: w.count,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};