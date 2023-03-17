import amqp from 'amqplib';
const CreateChannel = async () => {
    try {
        const connection = await amqp.connect(process.env.BROKER_URL)
        const channel = await connection.createChannel();
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
        channel.ack(data);
    })

}

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
    headers,
    error
}