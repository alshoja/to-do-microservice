import TodoModule from '../controllers/Todo.js'
import isGuarded from '../middleware/isLoggedIn.js'
export default (router, channel) => {
  const TodoController = TodoModule(channel);
  router.get("/",isGuarded, TodoController.getAllTodo);
  router.get("/:todoId/", isGuarded, TodoController.getTodo);
  router.post("/create/", isGuarded, TodoController.createTodo);
  router.put("/:todoId/update", isGuarded, TodoController.updateTodo);
  router.delete("/:todoId/delete", isGuarded, TodoController.deleteTodo);
}


