import { User } from "../../models/user";
import { Database } from "../../globals/Database";
import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { JsonWebToken } from "../../../shared/interfaces/IJsonWebToken";
import { ObjectId } from "mongodb";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import * as multer from "multer";
const parseFile = multer({
  // dest: userPhotoDirectory,
  limits: { fileSize: 5000000, files: 1 },
}).single("image");

export class UserDashboardRouter extends BaseRouter {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.configureRouter();
  }

  private configureRouter(): void {
    // Register user
    this.router.use("/getuserinformation", this.createStandardLocalResponseObjects);
    this.router.use("/getuserinformation", this.checkForUserJsonWebToken);
    this.router.get("/getuserinformation", this.validateUserCredentials);

    // change user password
    this.router.use("/changepassword", this.createStandardLocalResponseObjects);
    this.router.use("/changepassword", this.checkForUserJsonWebToken);
    this.router.patch("/changepassword", this.validateUserChangePassword);

    // change username
    this.router.use("/changeusername", this.createStandardLocalResponseObjects);
    this.router.use("/changeusername", this.checkForUserJsonWebToken);
    this.router.patch("/changeusername", this.validateUserChangeUsername);

    // upload profile image
    this.router.use("/changeprofileimage", this.createStandardLocalResponseObjects);
    this.router.use("/changeprofileimage", this.checkForUserJsonWebToken);
    this.router.use("/changeprofileimage", this.validateUploadImage);
    this.router.patch("/changeprofileimage", this.storeUploadedImageInDatabase);
  }

  private async validateUserCredentials(req: Request, res: Response) {
    let db;
    try {
      db = await Database.CreateDatabaseConnection();
      const usersCollection = db.collection("Users");
      // TODO: why does this have to be to return as an array?
      // return only the username for the time being, omit the userid
      const databaseUsers: User[] = await usersCollection.find(
        { "_id": new ObjectId(res.locals.token.id) },
        { "username": 1, "profileImage": 1, "_id": 0 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        res.status(503).json(res.locals.responseMessages.generalError());
        res.send();
        db.close();
        return;
      }
      // we are looking by object id there should only user in this array.
      res.status(200).json(res.locals.responseMessages.dashboardUserFound(databaseUsers[0]));
      res.end();
      return;
    } catch (error) {
      // TOOD: log error?
      res.status(503).json(res.locals.responseMessages.generalError());
      res.send();
      db.close();
      return;
    }
  }

  private async validateUserChangePassword(req: Request, res: Response) {
    let db;
    try {
      if (!await UserAuthenicationValidator.isPasswordValid(req.body.currentPassword) || !await UserAuthenicationValidator.isPasswordValid(req.body.newPassword)) {
        res.status(422).json(res.locals.responseMessages.passwordIsNotValid());
        res.send();
        db.close();
        return;
      }

      // TODO: abstract this chunk of code, it is going to be come extremely redundant.
      db = await Database.CreateDatabaseConnection();
      const usersCollection = db.collection("Users");
      const databaseUsers: User[] = await usersCollection.find(
        { "_id": new ObjectId(res.locals.token.id) },
        { "password": 1, "_id": 1 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        db.close();
        res.status(422).json(res.locals.responseMessages.noUserFound());
        res.send();
        db.close();
        return;
      }

      if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(req.body.currentPassword, databaseUsers[0].password)) {
        db.close();
        res.status(401).json(res.locals.responseMessages.passwordsDoNotMatch());
        res.send();
        db.close();
        return;
      }
      const user = new User(databaseUsers[0].username, databaseUsers[0].email, req.body.newPassword);
      if (!await user.updateUserPassword()) {
        db.close();
        res.status(503).json(res.locals.responseMessages.generalError());
        res.send();
        db.close();
        return;
      }

      const updateResult = await usersCollection.updateOne(
        { "_id": new ObjectId(databaseUsers[0]._id) },
        { $set: { "password": user.password, "modifiedAt": user.modifiedAt } }
      );

      db.close();
      if (updateResult.modifiedCount === 1) {
        res.status(200).json(res.locals.responseMessages.userChangedPasswordSuccessfully());
        res.send();
        db.close();
        return;
      } else {
        throw new Error("There was nothing updated");
      }

    } catch (error) {
      console.log(error);
      // TOOD: log error?
      res.status(503).json(res.locals.responseMessages.generalError());
      res.end();
      db.close();
    }
  }

  private async validateUserChangeUsername(req: Request, res: Response) {
    let db;
    try {
      if (!await UserAuthenicationValidator.isUserNameValid(req.body.newUsername)) {
        res.status(422).json(res.locals.responseMessages.usernameIsNotValid());
        res.end();
        db.close();
        return;
      }
      if (!await UserAuthenicationValidator.isPasswordValid(req.body.password)) {
        res.status(422).json(res.locals.responseMessages.passwordIsNotValid());
        res.end();
        db.close();
        return;
      }
      // TODO: abstract this chunk of code, it is going to be come extremely redundant.
      db = await Database.CreateDatabaseConnection();
      const usersCollection = db.collection("Users");
      const existingUsers: User[] = await usersCollection.find(
        { "username": req.body.newUsername }, { "_id": 1 }
      ).toArray();
      if (existingUsers.length > 0) {
        res.status(409).json(res.locals.responseMessages.usernameIsTaken(req.body.newUsername));
        res.end();
        db.close();
        return;
      }
      const databaseUsers: User[] = await usersCollection.find(
        { "_id": new ObjectId(res.locals.token.id) },
        { "password": 1, "_id": 1 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        res.status(422).json(res.locals.responseMessages.noUserFound());
        res.end();
        db.close();
        return;
      }
      if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(req.body.password, databaseUsers[0].password)) {
        res.status(401).json(res.locals.responseMessages.passwordsDoNotMatch());
        res.end();
        db.close();
        return;
      }
      const user = new User(req.body.newUsername);
      const updateResult = await usersCollection.updateOne(
        { "_id": new ObjectId(databaseUsers[0]._id) },
        { $set: { "username": user.username, "modifiedAt": user.modifiedAt } }
      );
      if (updateResult.modifiedCount === 1) {
        res.status(200).json(res.locals.responseMessages.usernameChangeSuccessful(user.username));
        res.end();
        db.close();
        return;
      } else {
        throw new Error("Nothing was modified");
      }
    } catch (error) {
      console.log(error);
      res.status(503).json(res.locals.responseMessages.generalError());
      res.end();
      db.close();
    }
  }


  private async validateUploadImage(req: any, res: Response, next: NextFunction) {
    try {
      parseFile(req, res, (err) => {
        if (err) {
          res.status(413).json(res.locals.responseMessages.profilePictureUploadFailedFileToBig());
          res.end();
          return;
        }
        const imageFileExtensions: string[] = ["png", "jpg", "jpeg", "gif"];
        const imageTypeArray = req.file.mimetype.split("/");
        const imageType = imageTypeArray[1];
        for (let i = 0; i < imageFileExtensions.length; i++) {
          if (imageType === imageFileExtensions[i]) {
            const image = `data:image/${imageType};base64,` + req.file.buffer.toString("base64");
            res.locals.image = image;
            next();
            return;
          }
        }
        // Unsupported Media Type
        res.status(415).json(res.locals.responseMessages.profilePictureUploadFailedUnsupportedType());
        res.end();
        return;


      });
    } catch (error) {
      console.log(error);
      res.status(503).json(res.locals.responseMessages.generalError());
      res.end();
    }
  }

  private async storeUploadedImageInDatabase(req: any, res: Response) {
    let db;
    try {
      db = await Database.CreateDatabaseConnection();
      const usersCollection = db.collection("Users");
      const updatedProfile = await usersCollection.findOneAndUpdate(
        { "_id": new ObjectId(res.locals.token.id) },
        { $set: { "profileImage": res.locals.image } }
      );
      if (updatedProfile.lastErrorObject.updatedExisting && updatedProfile.lastErrorObject.n === 1) {
        res.status(200).json(res.locals.responseMessages.changeProfilePictureSuccessful());
        db.close();
        res.end();
      } else {
        throw new Error("Updating user profile picture didn't work");
      }
    } catch (error) {
      console.log(error);
      res.status(503).json(res.locals.responseMessages.generalError());
      res.end();
    }
  }
}
