const amqp = require('amqplib')

module.exports.CreateChannel = async () => {
    try {
        const connection = await amqp.connect(process.env.BROKER_URL)
        const channel = await connection.createChannel();
        await channel.assertExchange(process.env.EXCHANGE_NAME, 'direct', false);
        return channel;
    } catch (error) {
        throw error
    }
}

module.exports.PublishMessage = async (channel, binding_key, message) => {
    try {
        await channel.publish(process.env.EXCHANGE_NAME, binding_key, Buffer.from(message))
    } catch (error) {
        throw error
    }
}

module.exports.SubscribeMessage = async (channel, service, binding_key) => {
    const appQueue = await channel.assertQueue(process.env.QUEUE_NAME);
    channel.bindQueue(appQueue.queue, process.env.EXCHANGE_NAME, binding_key);
    channel.consume(appQueue.queue, data => {
        console.log('data received ');
        console.log(data.content.toString())
        channel.ack(data);
    })

}