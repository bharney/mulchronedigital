import { Resolve } from "@angular/router";
import { MongoClient, Db } from "mongodb";

export class Database {
  public static CreateDatabaseConnection(): Promise<Db> {
    return new Promise((resolve, reject) => {
      let url;
      // TODO: put heroku DB string here.
      (!process.env.MONGO_URL) ? url = "mongodb://localhost:27017/Node-Angular-Starter" : url = process.env.MONGO_URL;
      MongoClient.connect(url)
        .then((db: Db) => {
          resolve(db);
        })
        .catch((error: Error) => {
          reject(false);
        });
    });
  }

  public static InsertDocument(): void {}

  public static UpdateDocument(): void {}

  public static DeleteDocument(): void {}

  public static GetDocument(): void {}

  public static SeedDatabase(): void {}
}
