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

exports.getAllActivity = (req, res) => {
  // simply use .find() method and it will return all the todos
  Activity.find()
    .sort("-createdAt")
    .exec((err, todos) => {
      // error checking
      if (err || !todos) {
        return res.status(400).json({
          error: "Something went wrong in finding all todos",
        });
      }
      // return all the todos in json format
      res.json(todos);
    });
};
