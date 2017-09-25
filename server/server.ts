import { Request } from "request";
import debug = require("debug");
import express = require("express");
import path = require("path");
import logger = require("morgan");
import bodyParser = require("body-parser");
import cluster = require("cluster");

import { IndexRouter } from "./routes/IndexRouter";
import { Database } from "./globals/Database";

class Server {
  public port = process.env.PORT || 8080;
  public app: express.Application;
  private indexRouter: express.Router;

  constructor() {
    this.app = express();
    this.indexRouter = new IndexRouter().router;
    this.configureMiddleware();
  }

  private configureMiddleware(): void {
    this.app.use(logger("dev"));
    this.app.use(express.static(path.join(process.env.PWD + "/dist/client/")));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.text());
    this.app.use(bodyParser.json({ type: "application/vnd.api+json" }));
    this.app.disable("x-powered-by");
    this.app.use("/", this.indexRouter);
  }
}

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
