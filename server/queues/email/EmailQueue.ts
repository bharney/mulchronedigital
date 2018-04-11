import open = require("amqplib");
import { EmailQueueMessagesFactory } from "./EmailQueueMessagesFactory";
import ActivateUserEmailMessage from "./messages/ActivateUserEmailMessage";
import { User } from "../../models/User";
import errorLogger from "../../logging/ErrorLogger";
import { ContactMe } from "../../../shared/ContactMe";
import ForgotPasswordMessage from "./messages/ForgotPasswordMessage";
import ContactMeMessage from "./messages/ContactMeMessage";

export class EmailQueue {
  private emailQueueChannel = "email_queue";
  private connectionString;
  private badConnectionAttempts = null;
  private channel;
  private emailQueueMessagesFactory: EmailQueueMessagesFactory;

  constructor() { }

  public async createChannelForEmailQueue(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connectionString = (!process.env.RABBITMQ_URL) ? "amqp://localhost" : process.env.RABBITMQ_URL;
      open.connect(this.connectionString)
        .then(connection => {
          return connection.createChannel();
        })
        .then(ch => {
          ch.assertQueue(this.emailQueueChannel, { durable: true });
          this.channel = ch;
          this.emailQueueMessagesFactory = new EmailQueueMessagesFactory();
          resolve(true);
        })
        .catch(async (error) => {
          reject(error);
        });
    });
  }

  public async sendUserActivationEmailToQueue(user: User): Promise<boolean> {
    try {
      const activateUserEmailMessage: ActivateUserEmailMessage = await this.emailQueueMessagesFactory.getEmailQueueMessage("activate_user_email");
      activateUserEmailMessage.username = user.username;
      activateUserEmailMessage.email = user.email;
      activateUserEmailMessage._id = user._id;
      if (await this.sendMessageToEmailQueue(activateUserEmailMessage)) {
        return true;
      }
      return false;
    } catch (error) {
      errorLogger.error(error);
    }
  }

  public async sendUserForgotPasswordToQueue(email: string, userId: string, tokenId: string, newPassword: string): Promise<boolean> {
    try {
      const userForgotPasswordMessage: ForgotPasswordMessage = await this.emailQueueMessagesFactory.getEmailQueueMessage("user_forgot_password");
      userForgotPasswordMessage.email = email;
      userForgotPasswordMessage.tokenId = tokenId;
      userForgotPasswordMessage.newPassword = newPassword;
      // TODO: assign the userID that needs to be sent in the email and checked as well as the tokenId
      if (await this.sendMessageToEmailQueue(userForgotPasswordMessage)) {
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
      const contactMeMessage: ContactMeMessage = await this.emailQueueMessagesFactory.getEmailQueueMessage("contact_me_message");
      contactMeMessage.message = contactMeObject.message;
      contactMeMessage.userEmail = contactMeObject.userEmail;
      contactMeMessage.userName = contactMeObject.userName;
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
      this.channel.sendToQueue(this.emailQueueChannel, new Buffer(JSON.stringify(message)), { persistent: true });
      return true;
    } catch (error) {
      errorLogger.error(error);
      return false;
    }
  }
}
