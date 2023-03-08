const mongoose = require("mongoose");

const Activity = new mongoose.Schema(
  {
    activity: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 60,
    },
    taskId: {
      type: String,
      required: false,
      trim: true,
    },
    owner: {
      type: String,
      required: true,
      trim: true,
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Activity", Activity);
