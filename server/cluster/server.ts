import { Request } from "request";
import debug = require("debug");
import express = require("express");
import path = require("path");
import logger = require("morgan");
import bodyParser = require("body-parser");
import cluster = require("cluster");

import { ClusterMiddleware } from "../middleware/cluster";
import { IndexRouter } from "../routes/index-router";

export default class Server {
  public port = process.env.PORT || 8080;
  public app: express.Application;
  private indexRouter: express.Router;
  private clusterMiddleware: ClusterMiddleware;
  // TODO: play with this number in production.

  constructor() {
    this.app = express();
    this.indexRouter = new IndexRouter().router;
    this.clusterMiddleware = new ClusterMiddleware();
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
    this.app.use("/", this.clusterMiddleware.DoesWorkerNeedToRestart);
    this.app.use("/", this.indexRouter);
  }
}
