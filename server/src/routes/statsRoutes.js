const express = require("express");
const { getStats } = require("../controllers/statsController");
const auth = require("../middleware/auth");

const router = express.Router();
router.get("/", auth, getStats);

module.exports = router;