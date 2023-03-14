const ActivityModule = require("../controllers/Activity");

module.exports = (router, channel) => {
  const ActivityController = ActivityModule(channel)
  router.get('/', ActivityController.status)
  router.post("/create", ActivityController.createActivity);
  router.get("/activities", ActivityController.getAllActivity);
}


