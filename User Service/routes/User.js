const express = require("express");
const router = express.Router();

const {
  signUp,
  deleteUser,
  getAllUser,
  updateUser,
  getUser,
  login
} = require("../controllers/User");

router.post("/login", login);
router.post("/user/create/", signUp);


// to get all the todos
// router.get("/users/", getAllUser);

// to get a single todo
// router.get("/user/:userId/", getUser);

// to create a todo

// to update the todo
// router.put("/user/:userId/update", updateUser);

// to delete the todo
// router.delete("/user/:userId/delete", deleteUser);

// we will export the router to import it in index.js
module.exports = router;
