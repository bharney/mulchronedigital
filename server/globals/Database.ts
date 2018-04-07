import { UserAction } from "../models/UserAction";
import { Resolve } from "@angular/router";
import { MongoClient, Db, Collection } from "mongodb";
import { User } from "../models/User";
import { ForgotPasswordToken } from "../models/ForgotPasswordToken";

export class Database {
  public CreateDatabaseConnection(): Promise<Db> {
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

  public async SeedDatabase(): Promise<boolean> {
    const db = await this.CreateDatabaseConnection();
    try {
      const userCollection = await db.listCollections({ "name": "Users" }).toArray();
      if (userCollection.length <= 0) {
        if (!await this.CreateCollections(db)) {
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

  private async CreateCollections(db: Db): Promise<boolean> {
    try {
      const usersCollection: Collection<User> = await db.createCollection<User>("Users");
      if (!await this.CreateUserCollectionIndexes(usersCollection)) {
        throw new Error("user collection index creation failed");
      }

      if (!await this.CreateUserObjects(usersCollection)) {
        throw new Error("user objects usersCollection");
      }

      const userActionsCollection: Collection<UserAction> = await db.createCollection<UserAction>("UserActions");
      if (!await this.createUserActionCollectionIndexes(userActionsCollection)) {
        throw new Error("user action collection index creation failed");
      }

      const userForgotPasswordTokens: Collection<ForgotPasswordToken> = await db.createCollection<ForgotPasswordToken>("UserForgotPasswordTokens");
      if (!await this.createUserForgotPasswordTokensIndexes(userForgotPasswordTokens)) {
        throw new Error("user forgot password tokens index creation failed");
      }
      return true;
    } catch (error) {
      console.log(error);
      // TODO: log error??
      return false;
    }
  }

  private async createUserActionCollectionIndexes(collection: Collection<UserAction>): Promise<boolean> {
    try {
      const indexes: object[] = [
        {
          "key": {
            userId: 1
          },
          "name": "userId",
          background: true
        },
        {
          "key": {
            actionType: 1
          },
          "name": "actionType",
          background: true
        },
        {
          "key": {
            happenedAt: 1
          },
          "name": "happenedAt",
          background: true
        },
      ];
      await collection.createIndexes(indexes);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async CreateUserCollectionIndexes(collection: Collection<User>): Promise<boolean> {
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

  private async createUserForgotPasswordTokensIndexes(collection: Collection<ForgotPasswordToken>): Promise<boolean> {
    try {
      const indexes: object[] = [
        {
          "key": {
            validUntil: 1
          },
          "name": "validUntil",
          unique: true,
          background: true
        },
        {
          "key": {
            userId: 1
          },
          "name": "userId",
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

  private async CreateUserObjects(collection: Collection<User>): Promise<boolean> {
    try {
      const usernames: string[] = ["admin", "basicuser", "basicinactiveuser"];
      const emails: string[] = ["admin@gmail.com", "basicuser@gmail.com", "basicinactiveuser@gmail.com"];
      const newUsers: User[] = [];
      for (let i = 0; i < usernames.length; i++) {
        const newUser: User = new User(usernames[i], emails[i], "Password1234!@#$");
        if (i === 0) {
          newUser.isAdmin = true;
        }
        if (!newUser.username.includes("inactive")) {
          newUser.isActive = true;
        }
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
