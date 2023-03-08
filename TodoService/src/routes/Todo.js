const express = require("express");
const router = express.Router();

// these are the controllers
// we will create all of them in future
const {
  createTodo,
  getTodoById,
  getTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
} = require("../controllers/Todo");

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Todo Service Up' });
})

//params
// it will fetch the value from the url
router.param("todoId", getTodoById);

// to get all the todos
router.get("/", getAllTodos);

// to get a single todo
router.get("/:todoId/", getTodo);

// to create a todo
router.post("/create/", createTodo);

// to update the todo
router.put("/:todoId/update", updateTodo);

// to delete the todo
router.delete("/:todoId/delete", deleteTodo);

// we will export the router to import it in index.js
module.exports = router;
