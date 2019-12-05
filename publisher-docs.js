const amqp = require("amqplib");

const queue = process.argv[3] || "jobs";
const msg = { number: process.argv[2] };

connect();

async function connect() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    // const result = await channel.assertQueue(queue);

    channel.assertQueue(queue, { // send to Queue directly without an exchange *

      durable: true,    // Durable = (the queue will survive a broker restart)

      // exclusive: true,   // Exclusive (used by only one connection and the queue will be deleted when that connection closes)
    });

    // channel.assertExchange('logs', 'fanout', {durable: false}) // send it to an Exchange - type fanout

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
      persistent: true // Durable Storage
    })

    // channel.publish('logs', '', Buffer.from('Hello World!'));
    // The empty string as second parameter means that we don't want to send the message to any specific queue.
    // We want only to publish it to our 'logs' exchange.


    // channel.bindQueue(queue_name, exchange_name, 'binding_key');
    // A binding is a relationship between an exchange and a queue.
    // This can be simply read as: the queue is interested in messages from this exchange.
    //
    // Direct exchange = a message goes to the queues whose binding key exactly matches the routing key of the message.
    // Multiple bindings =  bind multiple queues with the same binding key

    console.log(`Job sent successfully: ${msg.number}`);

    console.log("Conection will close.");
    setTimeout(() => {
      connection.close();
      process.exit(0)
    }, 500);

  } catch(e) {
    console.log(e);
  }

}

// channel.sendToQueue =  using a default exchange, which is identified by the empty string ("").

/*
An exchange is a very simple thing.
On one side it receives messages from producers and the other side it pushes them to queues.
The exchange must know exactly what to do with a message it receives.
Should it be appended to a particular queue? Should it be appended to many queues?
Or should it get discarded. The rules for that are defined by the exchange type.

[PUBLISHER] -> [EXCHANGE] -> [QUEUE]
*/
