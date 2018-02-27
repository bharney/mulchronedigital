import { Database } from "./globals/Database";
import { EmailQueue } from "./queues/EmailQueue";
import Server from "./server";

let db;
let UsersCollection;
let UserActionsCollection;
let ForgotPasswordCollection;
let EmailQueueExport: EmailQueue;

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
  try {
    const queue = new EmailQueue();
    EmailQueueExport = queue;
    return true;
  } catch (error) {
    return false;
  }
}

async function startServer(): Promise<void> {
  try {
    const newServer = new Server();
    const serverWorker = newServer.app.listen(newServer.port, () => {
      console.log(`Server is listening on ${newServer.port}`);
    });

  } catch (error) {
    console.log(`This process failed to start`);
  }
}

makeDbConnection()
  .then(response => {
    if (response) {
      return createEmailQueueConnection();
    }
  })
  .then(response => {
    if (response) {
      startServer();
    }
  })
  .catch(error => {
    process.exit();
  });

export { UsersCollection, UserActionsCollection, EmailQueueExport, ForgotPasswordCollection };
