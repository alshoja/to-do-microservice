import Activity from "../models/Activity.js";
export default (channel) => {
  const status = (req, res) => {
    res.status(200).json({ message: 'Activity Service Up' });
  }

  const createActivity = (req, res) => {
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

  const getAllActivity = (req, res) => {
    Activity.find()
      .sort("-createdAt")
      .exec((err, todos) => {
        if (err || !todos) {
          return res.status(400).json({
            error: "Something went wrong in finding all todos",
          });
        }
        res.json(todos);
      });
  };

  return {
    status,
    createActivity,
    getAllActivity
  }
}
