import amqp = require("amqplib/callback_api");

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err2, ch) {
      var q = 'hello';
  
      ch.assertQueue(q, {durable: false});
      // Note: on Node 6 Buffer.from(msg) should be used
      ch.sendToQueue(q, new Buffer('Hello World!'));
      console.log(" [x] Sent 'Hello World!'");
    });
  });