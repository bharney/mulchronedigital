import { Database } from "../globals/Database";
import Server from "./server";
import { Db } from "mongodb";
import cluster = require("cluster");

let db;
let databaseConnectionFailures = 0;

makeDbConnection();

if (cluster.isMaster && db !== null) {
  isMaster();
} else if (cluster.isWorker && db !== null) {
  isWorker();
}

async function isMaster() {
  try {
    console.log(`Master ${process.pid} is running`);
    console.log(`Master ${process.pid} running database seed`);
    if (await Database.SeedDatabase()) {
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

async function isWorker() {
  try {
    const newServer = new Server();
    const serverWorker = newServer.app.listen(newServer.port, () => {
      console.log(`Server is listening on ${newServer.port}`);
    });
  } catch (error) {
    console.log(`This process failed to start`);
  }
}

async function makeDbConnection() {
  try {
    db = await Database.CreateDatabaseConnection();
  } catch (error) {
    databaseConnectionFailures++;
    if (databaseConnectionFailures === 25) {
      console.log("Database connection failed 25 times, stopping process");
      process.exit();
    }
    return makeDbConnection();
  }
}

export { db };
