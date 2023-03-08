const express = require("express");
const router = express.Router();

const {
  createActivity,
} = require("../controllers/Activity");

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Activity Service Up' });
})

router.post("/create", createActivity);

module.exports = router;
