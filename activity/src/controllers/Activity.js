const Activity = require("../models/Activity");



exports.createActivity = (req, res) => {
  const activity = new Activity(req.body);
  activity.save((err, task) => {
    if (err || !task) {
      return res.status(400).json({
        error: "something went wrong",
      });
    }
    res.json({ task });
  });
};

