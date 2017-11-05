import { Resolve } from "@angular/router";
import { MongoClient, Db, Collection } from "mongodb";
import { User } from "../models/user";

export class Database {
  public static databaseConnectionFailures: number = 0;

  public static CreateDatabaseConnection(): Promise<Db> {
    return new Promise((resolve, reject) => {
      let url;
      (!process.env.MONGO_URL) ? url = "mongodb://localhost:27017/Node-Angular-Starter" : url = process.env.MONGO_URL;
      const options = {
        poolSize: 100
      };
      MongoClient.connect(url, options)
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
      const collection: Collection<User> = await db.createCollection<User>("Users");
      if (!await this.CreateUserCollectionIndexes(collection)) {
        throw new Error("user collection index creation failed");
      }

      if (!await this.CreateUserObjects(collection)) {
        throw new Error("user objects failed");
      }

      return true;
    } catch (error) {
      console.log(error);
      // TODO: log error??
      return false;
    }
  }

  private static async CreateUserCollectionIndexes(collection: Collection<User>): Promise<boolean> {
    try {
      const indexes: object[] = [
        {
          "key": {
            username: 1
          },
          "name": "username",
          unique: true,
          background: true
        },
        {
          "key": {
            email: 1
          },
          "name": "email",
          unique: true,
          background: true
        }
      ];
      await collection.createIndexes(indexes);
      return true;
    } catch (error) {
      return false;
    }
  }

  private static async CreateUserObjects(collection: Collection<User>): Promise<boolean> {
    try {
      const usernames: string[] = ["admin", "basicuser"];
      const emails: string[] = ["admin@gmail.com", "basicuser@gmail.com"];
      const newUsers: User[] = [];
      for (let i = 0; i < usernames.length; i++) {
        const newUser: User = new User(usernames[i], emails[i], "Password1234!@#$");
        if (await newUser.SetupNewUser()) {
          newUsers.push(newUser);
        }
      }
      await collection.insertMany(newUsers);
      return true;
    } catch (error) {
      // TODO: log error??
      return false;
    }
  }
}
