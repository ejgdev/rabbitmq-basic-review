const amqp = require("amqplib");
const fs = require('fs');

connect();

async function connect() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();

    // channel.prefetch(1);
    /* prefetch:
    This tells RabbitMQ not to give more than one message to a worker at a time. Or, in other words,
    don't dispatch a new message to a worker until it has processed and acknowledged the previous one.
    Instead, it will dispatch it to the next worker that is not still busy.
    */

    channel.consume("commission", message => {
      const input = JSON.parse(message.content.toString());
      console.log(`received job with input ${input}`);

      fs.writeFile("database.txt", JSON.stringify(input, null, 2), {flag: 'a'}, (error) => { console.log(error)});
      channel.ack(message)
    })

    console.log("Waiting for messages...");
  } catch(e) {
    console.err(e);
  }
}
