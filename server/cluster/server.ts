import debug = require("debug");
import express = require("express");
import path = require("path");
import logger = require("morgan");
import bodyParser = require("body-parser");
import compression = require("compression");

import { IndexRouter } from "../routes/IndexRouter";
import { Database } from "../globals/Database";
import { NextFunction, Request, Response } from "express";

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
    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.text());
    this.app.use(bodyParser.json({ type: "application/vnd.api+json" }));
    this.app.disable("x-powered-by");
    this.app.enable("trust proxy");
    this.app.use("/", this.configureRequestHeaders);
    this.app.use("/", this.indexRouter);
  }

  private async configureRequestHeaders(req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }
}
