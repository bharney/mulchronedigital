import { Resolve } from "@angular/router";
import { MongoClient, Db } from "mongodb";

export class Database {
  public static CreateDatabaseConnection(): Promise<Db> {
    return new Promise((resolve, reject) => {
      let url;
      (!process.env.MONGO_URL) ? url = "mongodb://localhost:27017/Node-Angular-Starter" : url = process.env.MONGO_URL;
      MongoClient.connect(url)
        .then((db: Db) => {
          resolve(db);
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  public static InsertDocument(): void {}

  public static UpdateDocument(): void {}

  public static DeleteDocument(): void {}

  public static GetDocument(): void {}

  public static async SeedDatabase(): Promise<boolean> {
    try {
      const db = await this.CreateDatabaseConnection();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public static async GetUserValues() {

  }


}
