import { Database } from "../globals/Database";
import Server from "./server";
import cluster = require("cluster");

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  console.log(`Master ${process.pid} running database seed`);
  if (Database.SeedDatabase()) {
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
} else if (cluster.isWorker) {
  const newServer = new Server();
  const serverWorker = newServer.app.listen(newServer.port, () => {
    console.log(`Server is listening on ${newServer.port}`);
  });
}
