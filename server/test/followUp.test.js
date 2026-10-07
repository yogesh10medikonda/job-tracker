const test = require("node:test");
const assert = require("node:assert");
const { getFollowUps } = require("../src/utils/followUp");

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n) => new Date(Date.now() - n * DAY);
const make = (o) => ({ _id: "1", company: "Acme", role: "SDE", status: "applied", ...o });

test("flags applied apps with no update for 7+ days", () => {
  const out = getFollowUps([make({ appliedDate: daysAgo(10) })], "Yogesh");
  assert.strictEqual(out.length, 1);
  assert.match(out[0].reason, /10 days/);
});

test("ignores recent applications", () => {
  assert.strictEqual(getFollowUps([make({ appliedDate: daysAgo(2) })], "Yogesh").length, 0);
});

test("ignores rejected applications even with a past follow-up date", () => {
  const out = getFollowUps([make({ status: "rejected", followUpDate: daysAgo(3) })], "Yogesh");
  assert.strictEqual(out.length, 0);
});

test("follow-up date items sort first and the draft uses company and name", () => {
  const out = getFollowUps(
    [
      make({ _id: "a", company: "Stale", appliedDate: daysAgo(9) }),
      make({ _id: "b", company: "Due", status: "interview", followUpDate: daysAgo(1) }),
    ],
    "Yogesh"
  );
  assert.strictEqual(out[0]._id, "b");
  assert.match(out[0].draft.body, /Due/);
  assert.match(out[0].draft.body, /Yogesh/);
});