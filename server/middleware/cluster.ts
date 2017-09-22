import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import cluster = require("cluster");


export class ClusterMiddleware {
  private numberOfRequestsTillRestart = 5;

  public DoesWorkerNeedToRestart = (req: Request, res: Response, next: NextFunction) => {
    if (cluster.isWorker) {
      this.numberOfRequestsTillRestart--;
      if (this.numberOfRequestsTillRestart === 0) {
        // TODO: Log that a worker process was shutdown due to requests.
        const originalRedirectUrl = req.originalUrl;
        const user: User = new User("Mike", "Esforces0191!@", true);
        user.HashPassword()
          .then(hashedPassword => {
            user.password = hashedPassword;
            res.redirect(originalRedirectUrl);
            process.exit(0);
            console.log(user.password);
            next();
          });
      }
    } else {
      next();
    }
  }

  
}
