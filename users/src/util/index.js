import amqp from 'amqplib';
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
  console.log('USER Messaging Queue Listening started')
  const appQueue = await channel.assertQueue(process.env.QUEUE_NAME);
  channel.bindQueue(appQueue.queue, process.env.EXCHANGE_NAME, binding_key);
  channel.consume(appQueue.queue, data => {
    console.log('data received in activity service', data.content.toString())
    service(data.content.toString());
    channel.ack(data);
  })
}

const RPCObserver = async (RPC_QUEUE_NAME, serveRPCRequest) => {
  console.log('USER RPC Messaging Queue Listening started')
  const channel = await getChannel();
  await channel.assertQueue(RPC_QUEUE_NAME, {
    durable: false,
  });

  channel.prefetch(1);
  channel.consume(
    RPC_QUEUE_NAME,
    async (msg) => {
      if (msg.content) {
        const payload = JSON.parse(msg.content.toString());
        const response = await serveRPCRequest(payload);
        console.log("🚀 ~ file: index.js:54 ~ response:", response)
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          {
            correlationId: msg.properties.correlationId,
          }
        );
        channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
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
  RPCObserver,
  headers,
  error
}