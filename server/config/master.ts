import { Database } from "../globals/Database";
import Server from "./server";
import { EmailQueue } from "../queues/EmailQueue";
import errorLogger from "../logging/ErrorLogger";

let db;
let UsersCollection;
let UserActionsCollection;
let ForgotPasswordCollection;
let EmailQueueExport: EmailQueue;


export async function usersCollectionIsFalsy(): Promise<void> {
  try {
    const database = new Database();
    if (!db) {
      db = await database.CreateDatabaseConnection();
    }
    UsersCollection = db.collection("Users");
  } catch (error) {
    errorLogger.error(error);
  }
}

export async function usersActionCollectionIsFalsy(): Promise<void> {
  try {
    const database = new Database();
    if (!db) {
      db = await database.CreateDatabaseConnection();
    }
    UserActionsCollection = db.collection("UserActions");
  } catch (error) {
    errorLogger.error(error);
  }
}

export async function forgotPasswordCollectionIsFalsy(): Promise<void> {
  try {
    const database = new Database();
    if (!db) {
      db = await database.CreateDatabaseConnection();
    }
    ForgotPasswordCollection = db.collection("UserForgotPasswordTokens");
  } catch (error) {
    errorLogger.error(error);
  }
}

async function makeDbConnection(): Promise<boolean> {
  const database = new Database();
  const connectionAttempts = 0;
  await makeDbConnectionHelper(database, connectionAttempts);
  return true;
}

async function makeDbConnectionHelper(database: Database, connectionAttempts: number): Promise<void> {
  try {
    if (connectionAttempts < 25) {
      db = await database.CreateDatabaseConnection();
      await database.SeedDatabase();
      UsersCollection = db.collection("Users");
      UserActionsCollection = db.collection("UserActions");
      ForgotPasswordCollection = db.collection("UserForgotPasswordTokens");
    } else {
      console.log("Database connection failed 25 times, stopping process");
      process.exit();
    }

  } catch (error) {
    connectionAttempts++;
    console.log("Datbase connection failed, retrying!!");
    return await makeDbConnectionHelper(database, connectionAttempts);
  }
}

async function createEmailQueueConnection(): Promise<boolean> {
  const emailQueue = new EmailQueue();
  const connectionAttempts = 24;
  await createEmailQueueConnectionHelper(emailQueue, connectionAttempts);
  return true;
}

async function createEmailQueueConnectionHelper(emailQueue: EmailQueue, connectionAttempts: number): Promise<void> {
  try {
    if (connectionAttempts < 25) {
      if (await emailQueue.createChannelForEmailQueue()) {
        EmailQueueExport = emailQueue;
      }
    } else {
      console.log("RabbitMQ connection failed 25 times, stopping process");
      process.exit();
    }
  } catch (error) {
    connectionAttempts++;
    return await createEmailQueueConnectionHelper(emailQueue, connectionAttempts);
  }
}

export { UsersCollection, UserActionsCollection, EmailQueueExport, ForgotPasswordCollection, makeDbConnection, createEmailQueueConnection };
