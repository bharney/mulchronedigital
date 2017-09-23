import cluster = require("cluster");
import { NextFunction, Request, Response } from "express";


export class ClusterMiddleware {
  private numberOfRequestsTillRestart = 5;

  public DoesWorkerNeedToRestart = (req: Request, res: Response, next: NextFunction) => {
    if (cluster.isWorker) {
      this.numberOfRequestsTillRestart--;
      if (this.numberOfRequestsTillRestart === 0) {
        // TODO: Log that a worker process was shutdown due to requests.
        const originalRedirectUrl = req.originalUrl;
        res.redirect(originalRedirectUrl);
        process.exit(0);
      }
    } else {
      next();
    }
  }
}
