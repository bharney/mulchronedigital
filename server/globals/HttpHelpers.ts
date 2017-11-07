import { Request } from "express";

export class HttpHelpers {

  constructor() { }

  public getIpAddressFromRequestObject(req: Request): Promise<string> {
    return new Promise((resolve, reject) => {
      let ip = req.ip;
      if (ip.substr(0, 7) === "::ffff:") {
        ip = ip.substring(7);
      }
      if (ip !== null) {
        resolve(ip);
      } else {
        reject(null);
      }
    });
  }
}
