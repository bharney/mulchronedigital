import { Database } from "../globals/Database";
import { EmailQueue } from "../queues/EmailQueue";
import Server from "./server";
import { Db } from "mongodb";
import cluster = require("cluster");

let db;
let UsersCollection;
let UserActionsCollection;
let EmailQueueExport: EmailQueue;

makeDbConnection()
  .then(response => {
    if (response) {
      return createEmailQueueConnection();
    }
  })
  .then(response => {
    if (response) {
      startCluster();
    }
  });

async function startCluster() {
  if (!process.env.MONGO_URL || !process.env.RABBITMQ_BIGWIG_URL) {
    spawnWorker();
  } else {
    // if (cluster.isMaster && db !== undefined) {
    //   await startMasterProcess();
    // } else if (cluster.isWorker && db !== undefined) {
      await spawnWorker();
  }
}

async function startMasterProcess(): Promise<void> {
  try {
    const database = new Database();
    console.log(`Master ${process.pid} is running`);
    console.log(`Master ${process.pid} running database seed`);
    if (await database.SeedDatabase()) {
      console.log(`Master ${process.pid} database seed complete`);
    }

    const numCPUs = require("os").cpus().length;
    for (let i = 0; i < 3; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } catch (error) {
    // TODO: what to do here for error handling?
  }
}

async function spawnWorker(): Promise<void> {
  try {
    const newServer = new Server();
    const serverWorker = newServer.app.listen(newServer.port, () => {
      console.log(`Server is listening on ${newServer.port}`);
    });

  } catch (error) {
    console.log(`This process failed to start`);
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
      UsersCollection = db.collection("Users");
      UserActionsCollection = db.collection("UserActions");
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

  }
}

export { UsersCollection, UserActionsCollection, EmailQueueExport };
