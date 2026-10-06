const Application = require("../models/Application");
const User = require("../models/User");
const { STATUSES } = require("../models/Application");
const { getFollowUps } = require("../utils/followUp");

const ALLOWED = [
  "company",
  "role",
  "jobUrl",
  "location",
  "salaryRange",
  "status",
  "appliedDate",
  "followUpDate",
  "notes",
  "jobDescription",
];

const pick = (body) =>
  Object.fromEntries(
    Object.entries(body).filter(([k]) => ALLOWED.includes(k))
  );

const escapeRegex = (s) =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const handleError = (res, err) => {
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: "Server error" });
};

exports.getAll = async (req, res) => {
  try {
    const { status, search, sort = "-createdAt" } = req.query;

    const filter = {
      userId: req.userId,
    };

    if (status) {
      filter.status = status;
    }

    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");

      filter.$or = [
        { company: rx },
        { role: rx },
      ];
    }

    const apps = await Application.find(filter).sort(sort);

    res.json(apps);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getOne = async (req, res) => {
  try {
    const app = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!app) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(app);
  } catch (err) {
    handleError(res, err);
  }
};

exports.create = async (req, res) => {
  try {
    const data = pick(req.body);

    const app = await Application.create({
      ...data,
      userId: req.userId,
      timeline: [
        {
          status: data.status || "wishlist",
        },
      ],
    });

    res.status(201).json(app);
  } catch (err) {
    handleError(res, err);
  }
};

exports.update = async (req, res) => {
  try {
    const app = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!app) {
      return res.status(404).json({ message: "Not found" });
    }

    const data = pick(req.body);

    if (data.status && data.status !== app.status) {
      app.timeline.push({
        status: data.status,
      });
    }

    Object.assign(app, data);

    await app.save();

    res.json(app);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const app = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!app) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    if (app.status !== status) {
      app.status = status;

      app.timeline.push({
        status,
      });

      await app.save();
    }

    res.json(app);
  } catch (err) {
    handleError(res, err);
  }
};

exports.remove = async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!app) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    handleError(res, err);
  }
};

exports.followUps = async (req, res) => {
  try {
    const [apps, user] = await Promise.all([
      Application.find({
        userId: req.userId,
      }),
      User.findById(req.userId).select("name"),
    ]);

    res.json(getFollowUps(apps, user.name));
  } catch (err) {
    handleError(res, err);
  }
};

exports.followUps = async (req, res) => {
  try {
    const [apps, user] = await Promise.all([
      Application.find({ userId: req.userId }),
      User.findById(req.userId).select("name"),
    ]);
    res.json(getFollowUps(apps, user.name));
  } catch (err) {
    handleError(res, err);
  }
};