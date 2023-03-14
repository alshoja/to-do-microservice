import TodoModule from '../controllers/Todo.js'
export default (router, channel) => {
  const TodoController = TodoModule(channel);
  router.get("/", TodoController.getAllTodo);
  router.get("/:todoId/", TodoController.getTodo);
  router.post("/create/", TodoController.createTodo);
  router.put("/:todoId/update", TodoController.updateTodo);
  router.delete("/:todoId/delete", TodoController.deleteTodo);
}


