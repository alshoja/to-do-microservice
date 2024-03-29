import { RPCRequest, SubscribeMessage } from "../util/index.js";
import Activity from "../models/Activity.js";
export default function (channel) {
  const status = (req, res) => {
    res.status(200).json({ message: 'Activity Service Up' });
  }

  const createActivity = async (task) => {
    const { name } = await RPCRequest('USER_RPC', {
      data: task.owner
    });
    const fullPayload = {
      activity: 'Created', description: name + ' added ' + task.task, taskId: task._id, owner: task.owner
    }
    console.log("🚀 ~ file: Activity.js:16 ~ createActivity ~ fullPayload:", fullPayload)

    const activity = new Activity(fullPayload);
    activity.save((err, task) => {
      if (err || !task) {
        return res.status(400).json({
          error: "something went wrong",
        });
      }
      // res.json({ task });
    });
  };

  const getAllActivity = (req, res) => {
    console.log('getting all activities')
    Activity.find()
      .sort("-createdAt")
      .exec((err, todos) => {
        if (err || !todos) {
          return res.status(400).json({
            error: "Something went wrong in finding all todos",
          });
        }
        res.json(todos);
      });
  };

  const SubscribeEvents = async (payload) => {
    console.log('Triggering.... activity Events')
    payload = JSON.parse(payload)
    console.log('payload from rabbit', payload);
    createActivity(payload);
  }

  SubscribeMessage(channel, SubscribeEvents, 'ACTIVITY_BINDING_KEY');

  return {
    status,
    getAllActivity
  }
}
