import open = require("amqplib");
import { User } from "../models/user";
import { QueueMessages } from "./QueueMessages";

export class EmailQueue {
  private emailQueueChannel = "email_queue";
  private connectionString;
  private badConnectionAttempts = null;
  private channel;
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

  public async sendUserActivationEmailToQueue(user: User): Promise<void> {
    const messages = new QueueMessages();
    const userDetails = await messages.userActivationDetailsMessage(user);
    await this.sendMessageToEmailQueue(userDetails);
  }

  public async sendUserForgotPasswordToQueue(email: string, userId: string, tokenId: string, newPassword: string): Promise<boolean> {
    
    try {
      const messages = new QueueMessages();
      const userForgotPassword = await messages.userForgotPasswordMessage(email, userId, tokenId, newPassword);
      if (await this.sendMessageToEmailQueue(userForgotPassword)) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  
  private async sendMessageToEmailQueue(message: any): Promise<boolean> {
    try {
      this.channel.sendToQueue(this.emailQueueChannel, new Buffer(JSON.stringify(message)), {persistent: true});
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
