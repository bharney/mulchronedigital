import { Database } from "../globals/Database";
import Server from "./server";
import { Db } from "mongodb";
import cluster = require("cluster");

let db;
let UsersCollection;

makeDbConnection().then(response => {
  if (response && process.env.MONGO_URL) {
    return startCluster();
  } else {
   return spawnWorker();
  }
});

async function startCluster() {
  if (cluster.isMaster && db !== null) {
    await startMasterProcess();
  } else if (cluster.isMaster && db !== null) {
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
    for (let i = 0; i < numCPUs; i++) {
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
  try {
    db = await database.CreateDatabaseConnection();
    UsersCollection = db.collection("Users");
    return true;
  } catch (error) {
    database.databaseConnectionFailures++;
    console.log("Datbase connection failed" + database.CreateDatabaseConnection.toString() + "!!");
    if (database.databaseConnectionFailures === 25) {
      console.log("Database connection failed 25 times, stopping process");
      process.exit();
    }
    return makeDbConnection();
  }
}

function isThisLocalhost(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    (!process.env.MONGO_URL) ? resolve(true) : resolve(false);
  });
}

export { UsersCollection };
