import { Request } from "express";

export class HttpHelpers {

  constructor() { }

  public getIpAddressFromRequestObject(ip: string): Promise<string> {
    return new Promise((resolve, reject) => {
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

  public getUserAgentFromRequestObject(headers: any): Promise<string> {
    return new Promise(resolve => {
        resolve(headers["user-agent"].toString());
    });
  }
}
