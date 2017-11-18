import open = require("amqplib");

export class EmailQueue {
  private emailQueueChannel = "email_queue";
  private connectionString;
  private badConnectionAttempts = null;
  public channel;
  constructor() {
    this.createChannelForEmailQueue();
  }

  private createChannelForEmailQueue(): void {
    this.connectionString = (!process.env.RABBITMQ_BIGWIG_URL) ? "amqp://localhost" : process.env.RABBITMQ_BIGWIG_URL;
    open.connect(this.connectionString)
      .then(connection => {
        return connection.createChannel();
      })
      .then(ch => {
        ch.assertQueue(this.emailQueueChannel, { durable: true });
        this.channel = ch;
      })
      .catch((error) => {
        if (this.badConnectionAttempts === 25) {
          console.log("RabiitMQ connection failed 25 times, shutting down process");
          process.exit();
        }
        if (error) {
          if (this.badConnectionAttempts === null) {
            this.badConnectionAttempts = 0;
          }
          this.badConnectionAttempts++;
          return this.createChannelForEmailQueue();
        }
      });
  }
}
