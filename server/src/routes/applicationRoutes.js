const express = require("express");
const c = require("../controllers/applicationController");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth); // protects every route below

router.get("/", c.getAll);
router.post("/", c.create);
router.get("/followups", c.followUps);
router.get("/:id", c.getOne);
router.put("/:id", c.update);
router.patch("/:id/status", c.updateStatus);
router.delete("/:id", c.remove);

module.exports = router;