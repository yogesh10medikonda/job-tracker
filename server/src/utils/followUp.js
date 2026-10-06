const DAY = 24 * 60 * 60 * 1000;
const STALE_DAYS = 7;
const ACTIVE = ["applied", "oa", "interview"];

const daysSince = (date) => Math.floor((Date.now() - new Date(date).getTime()) / DAY);

const buildDraft = (app, userName) => ({
  subject: `Following up on my ${app.role} application`,
  body: `Hi ${app.company} Hiring Team,

I hope you're doing well. I recently applied for the ${app.role} position and wanted to follow up to reiterate my interest in the role.

I'd be glad to share any additional information that would help with your review. Thank you for your time and consideration.

Best regards,
${userName}`,
});

const getFollowUps = (apps, userName) => {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const items = [];
  for (const a of apps) {
    if (!ACTIVE.includes(a.status)) continue;

    let reason = null;
    let priority = 0;
    if (a.followUpDate && new Date(a.followUpDate) <= endOfToday) {
      reason = `Follow-up date reached (${new Date(a.followUpDate).toLocaleDateString("en-GB")})`;
      priority = 2;
    } else if (a.status === "applied" && a.appliedDate && daysSince(a.appliedDate) >= STALE_DAYS) {
      reason = `No update for ${daysSince(a.appliedDate)} days since applying`;
      priority = 1;
    }
    if (!reason) continue;

    items.push({
      _id: a._id,
      company: a.company,
      role: a.role,
      status: a.status,
      reason,
      priority,
      draft: buildDraft(a, userName),
    });
  }
  return items.sort((x, y) => y.priority - x.priority);
};

module.exports = { getFollowUps, buildDraft };