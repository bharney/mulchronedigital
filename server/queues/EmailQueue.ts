import open = require("amqplib");
import { User } from "../models/user";
import { QueueMessages } from "./QueueMessages";
import errorLogger from "../logging/ErrorLogger";
import { ContactMe } from "../../shared/ContactMe";

export class EmailQueue {
  private emailQueueChannel = "email_queue";
  private connectionString;
  private badConnectionAttempts = null;
  private channel;

  constructor() {
    this.createChannelForEmailQueue();
  }

  private createChannelForEmailQueue(): void {
    this.connectionString = (!process.env.RABBITMQ_URL) ? "amqp://localhost" : process.env.RABBITMQ_URL;
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

  public async sendUserActivationEmailToQueue(user: User): Promise<boolean> {
    try {
      const messages = new QueueMessages();
      const userDetails = await messages.userActivationDetailsMessage(user);
      if (await this.sendMessageToEmailQueue(userDetails)) {
        return true;
      }
      return false;
    } catch (error) {
      errorLogger.error(error);
    }
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
      errorLogger.error(error);
      return false;
    }
  }

  public async sendContactMeMessageToQueue(contactMeObject: ContactMe): Promise<boolean> {
    try {
      const messages = new QueueMessages();
      const contactMeMessage = await messages.contactMeFormMessage(contactMeObject);
      if (await this.sendMessageToEmailQueue(contactMeMessage)) {
        return true;
      }
      return false;
    } catch (error) {
      errorLogger.error(error);
      return false;
    }
  }

  private async sendMessageToEmailQueue(message: any): Promise<boolean> {
    try {
      console.log(message);
      this.channel.sendToQueue(this.emailQueueChannel, new Buffer(JSON.stringify(message)), { persistent: true });
      return true;
    } catch (error) {
      errorLogger.error(error);
      return false;
    }
  }
}
