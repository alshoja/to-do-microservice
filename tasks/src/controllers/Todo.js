import Todo from "../models/Todo.js"
import { PublishMessage, SubscribeMessage } from "../util/index.js"

export default function (channel) {
  const getTodoById = (req, res, next, todoId) => {
    Todo.findById(todoId).exec((err, todo) => {
      if (err || !todo) {
        return res.status(400).json({
          error: "404 todo not found",
        });
      }
      req.todo = todo;
      next();
    });
  };

  const getAllTodo = (req, res) => {
    Todo.find()
      .sort("-createdAt")
      .exec((err, todos) => {
        // error checking
        if (err || !todos) {
          return res.status(400).json({
            error: "Something went wrong in finding all todos",
          });
        }
        res.json(todos);
      });
  };

  const getTodo = (req, res) => {
    return res.json(req.todo);
  };

  const createTodo = (req, res) => {
    const todo = new Todo(req.body);
    todo.save((err, task) => {
      if (err || !task) {
        return res.status(400).json({
          error: "something went wrong",
        });
      }
      PublishMessage(channel, 'ACTIVITY_BINDING_KEY', JSON.stringify(task))
      res.json({ task });
    });
  };

  const updateTodo = (req, res) => {
    const todo = req.todo;
    todo.task = req.body.task;

    todo.save((err, t) => {
      if (err || !t) {
        return res.status(400).json({
          error: "something went wrong while updating",
        });
      }
      res.json(t);
    });
  };

  const deleteTodo = (req, res) => {
    const todo = req.todo;
    todo.remove((err, task) => {
      if (err || !task) {
        return res.status(400).json({
          error: "something went wrong while deleting the category",
        });
      }
      res.json({
        task_deleted: task,
        message: "Todo deleted successfully!",
      });
    });
  };

  const SubscribeEvents = async (payload) => {
    console.log('Triggering.... Task Events')
    payload = JSON.parse(payload)
    console.log('payload from rabbit', payload)
  }

  SubscribeMessage(channel, SubscribeEvents, 'TASK_BINDING_KEY')

  return {
    getTodoById,
    getAllTodo,
    getTodo,
    deleteTodo,
    updateTodo,
    createTodo
  }
}

