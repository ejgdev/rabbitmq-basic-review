const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const publisher = require('./publisher');

// express server
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// create the RabbitMQ connection
const channel = publisher.createChannel("amqp://localhost:5672");

//get the data and send it throught RabbitMQ
app.post('/v1/:type', function(req, res) {
  const { type } = req.params;
  const { body } = req;

  publisher.publishToQueue(channel, type, body)
  res.status(200).send({ response: `body request sent to ${type} Queue`, body});
});


const server = require('http').createServer(app);
server.listen(3000, function() {
  console.log('Server started at port 3000, have fun!.');
});
