import ActivityModule from "../controllers/Activity.js";

export default (router, channel) => {
  const ActivityController = ActivityModule(channel)
  router.get('/', ActivityController.status)
  router.post("/create", ActivityController.createActivity);
  router.get("/activities", ActivityController.getAllActivity);
}


