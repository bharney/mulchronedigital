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

  public static async SeedDatabase(): Promise<boolean> {
    const db = await this.CreateDatabaseConnection();
    try {
      const userCollection = await db.listCollections({ "name": "Users" }).toArray();
      if (userCollection.length <= 0) {
        if (!await this.CreateUsersCollection(db)) {
          throw new Error("seed failed");
        }
      }
      db.close();
      return true;
    } catch (error) {
      db.close();
      return false;
    }
  }

  private static async CreateUsersCollection(db: Db): Promise<boolean> {
    try {
      const result = await db.createCollection("Users");
      // TODO: configure a bunch of insert statements to insert standard test users.
      return true;
    } catch (error) {
      return false;
    }
  }
}
