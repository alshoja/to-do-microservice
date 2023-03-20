import amqp from 'amqplib';
import { v4 as uuid4 } from 'uuid';

let amqplibConnection = null;
const getChannel = async () => {
  if (amqplibConnection === null) {
    amqplibConnection = await amqp.connect(process.env.BROKER_URL);
  }
  return await amqplibConnection.createChannel();
};

const CreateChannel = async () => {
  try {
    const channel = await getChannel()
    await channel.assertExchange(process.env.EXCHANGE_NAME, 'direct', false);
    return channel;
  } catch (error) {
    throw error
  }
}

const PublishMessage = async (channel, binding_key, message) => {
  try {
    await channel.publish(process.env.EXCHANGE_NAME, binding_key, Buffer.from(message))
  } catch (error) {
    throw error
  }
}

const SubscribeMessage = async (channel, service, binding_key) => {
  const appQueue = await channel.assertQueue(process.env.QUEUE_NAME);
  channel.bindQueue(appQueue.queue, process.env.EXCHANGE_NAME, binding_key);
  channel.consume(appQueue.queue, data => {
    console.log('data received in activity', data.content.toString())
    service(data.content.toString());
    channel.ack(data);
  })

}

const requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
  try {
    const channel = await getChannel();
    const q = await channel.assertQueue("", { exclusive: true });
    channel.sendToQueue(
      RPC_QUEUE_NAME,
      Buffer.from(JSON.stringify(requestPayload)),
      {
        replyTo: q.queue,
        correlationId: uuid,
      }
    );

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        channel.close();
        resolve("API could not fullfil the request!");
      }, 8000);
      channel.consume(
        q.queue,
        (msg) => {
          if (msg.properties.correlationId == uuid) {
            resolve(JSON.parse(msg.content.toString()));
            clearTimeout(timeout);
          } else {
            reject("data Not found!");
          }
        },
        {
          noAck: true,
        }
      );
    });
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
  const uuid = uuid4(); // correlationId
  return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
};

const headers = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}

const error = (error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message, status });
}


export {
  CreateChannel,
  PublishMessage,
  SubscribeMessage,
  RPCRequest,
  headers,
  error
}