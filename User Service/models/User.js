const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);
