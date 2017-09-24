import { Request } from "request";
import debug = require("debug");
import express = require("express");
import path = require("path");
import logger = require("morgan");
import bodyParser = require("body-parser");
import cluster = require("cluster");

import { IndexRouter } from "./routes/IndexRouter";
import { Database } from "./globals/Database";

export default class Server {
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

const newServer = new Server();
const serverWorker = newServer.app.listen(newServer.port, () => {
  console.log(`Server is listening on ${newServer.port}`);
  console.log(`running database seed`);
  Database.SeedDatabase();
  console.log(`database seed complete`);
});
