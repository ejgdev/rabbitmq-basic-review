const amqp = require("amqplib");

async function createChannel(url) {

  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    return channel;
  } catch(e) {
    console.log(e);
  }

};

async function publishToQueue(getChannel, type, data) {
  const channel = await getChannel;
  try {
    channel.assertQueue(type, { durable: true });
    channel.sendToQueue(type, Buffer.from(JSON.stringify(data)), { persistent: true });

    console.log(`Job sent successfully: ${data}`);
  } catch(e) {
    console.log(e);
  }

};

module.exports.createChannel = createChannel;
module.exports.publishToQueue = publishToQueue;
