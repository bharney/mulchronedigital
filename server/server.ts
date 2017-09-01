import cluster = require("cluster");
import debug = require("debug");
import express = require("express");
import path = require("path");
import logger = require("morgan");
import bodyParser = require("body-parser");
const numCPUs = require("os").cpus().length;

export class Server {
  public port: number = process.env.PORT || 8080;
  public app: express.Application;
  public indexRouter: express.Router;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configurePort();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(logger("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.text());
    this.app.use(bodyParser.json({ type: "application/vnd.api+json" }));
    this.app.disable("x-powered-by");
  }

  private configurePort(): void {
    this.app.set("port", process.env.PORT || 8080);
  }

  private configureRoutes(): void {
    this.app.get("/api", (req, res) => {
      res.json({ welcome: "home" });
    });
  }
}

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const newServer = new Server();
  const serverWorker = newServer.app.listen(newServer.port, () => {
      console.log(`Server is listening on ${newServer.port}`);
    });
}