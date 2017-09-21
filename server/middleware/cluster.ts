import { NextFunction, Request, Response } from "express";
import cluster = require("cluster");


export class ClusterMiddleware {
  private numberOfRequestsTillRestart = 10000;

  public DoesWorkerNeedRestart = (req: Request, res: Response, next: NextFunction) => {
    if (cluster.isWorker) {
      this.numberOfRequestsTillRestart--;
      if (this.numberOfRequestsTillRestart === 0) {
        // TODO: Log that a worker process was shutdown due to requests.
        process.exit(0);
      }
    }
    next();
  }
}
