import open = require("amqplib");

export class EmailQueue {
  private emailQueueChannel = "email_queue";
  private connectionString;
  private badConnectionAttempts = 0;
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
      ch.assertQueue(this.emailQueueChannel, {durable: true});
      this.channel = ch;
    })
    .catch((error) => {
      if (this.badConnectionAttempts === 25) {
        process.exit();
      }
      if (error) {
        this.badConnectionAttempts++;
        return this.createChannelForEmailQueue();
      }
    });
  }
}
