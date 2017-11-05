import { User } from "../../models/user";
import { Database } from "../../globals/Database";
import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { JsonWebToken } from "../../../shared/interfaces/IJsonWebToken";
import { ObjectId } from "mongodb";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import { UsersCollection } from "../../cluster/master";
import * as multer from "multer";
const parseFile = multer({
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
    try {
      // TODO: why does this have to be to return as an array?
      // return only the username for the time being, omit the userid
      const databaseUsers: User[] = await UsersCollection.find(
        { "_id": new ObjectId(res.locals.token.id) },
        { "username": 1, "profileImage": 1, "_id": 0 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        return res.status(503).json(res.locals.responseMessages.generalError());
      }
      // we are looking by object id there should only user in this array.
      return res.status(200).json(res.locals.responseMessages.dashboardUserFound(databaseUsers[0]));
    } catch (error) {
      // TOOD: log error?
      return res.status(503).json(res.locals.responseMessages.generalError());
    }
  }

  private async validateUserChangePassword(req: Request, res: Response) {
    try {
      if (!await UserAuthenicationValidator.isPasswordValid(req.body.currentPassword) || !await UserAuthenicationValidator.isPasswordValid(req.body.newPassword)) {
        return res.status(422).json(res.locals.responseMessages.passwordIsNotValid());
      }

      // TODO: abstract this chunk of code, it is going to be come extremely redundant.
      const databaseUsers: User[] = await UsersCollection.find(
        { "_id": new ObjectId(res.locals.token.id) },
        { "password": 1, "_id": 1 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        return res.status(422).json(res.locals.responseMessages.noUserFound());
      }

      if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(req.body.currentPassword, databaseUsers[0].password)) {
        return res.status(401).json(res.locals.responseMessages.passwordsDoNotMatch());
      }
      const user = new User(databaseUsers[0].username, databaseUsers[0].email, req.body.newPassword);
      if (!await user.updateUserPassword()) {
        return res.status(503).json(res.locals.responseMessages.generalError());
      }

      const updateResult = await UsersCollection.updateOne(
        { "_id": new ObjectId(databaseUsers[0]._id) },
        { $set: { "password": user.password, "modifiedAt": user.modifiedAt } }
      );

      if (updateResult.modifiedCount === 1) {
        return res.status(200).json(res.locals.responseMessages.userChangedPasswordSuccessfully());
      } else {
        throw new Error("There was nothing updated");
      }

    } catch (error) {
      console.log(error);
      // TOOD: log error?
      return res.status(503).json(res.locals.responseMessages.generalError());
    }
  }

  private async validateUserChangeUsername(req: Request, res: Response) {
    try {
      if (!await UserAuthenicationValidator.isUserNameValid(req.body.newUsername)) {
        return res.status(422).json(res.locals.responseMessages.usernameIsNotValid());
      }
      if (!await UserAuthenicationValidator.isPasswordValid(req.body.password)) {
        return res.status(422).json(res.locals.responseMessages.passwordIsNotValid());
      }
      // TODO: abstract this chunk of code, it is going to be come extremely redundant.
      const existingUsers: User[] = await UsersCollection.find(
        { "username": req.body.newUsername }, { "_id": 1 }
      ).toArray();
      if (existingUsers.length > 0) {
        return res.status(409).json(res.locals.responseMessages.usernameIsTaken(req.body.newUsername));
      }
      const databaseUsers: User[] = await UsersCollection.find(
        { "_id": new ObjectId(res.locals.token.id) },
        { "password": 1, "_id": 1 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        return res.status(422).json(res.locals.responseMessages.noUserFound());
      }
      if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(req.body.password, databaseUsers[0].password)) {
        return res.status(401).json(res.locals.responseMessages.passwordsDoNotMatch());
      }
      const user = new User(req.body.newUsername);
      const updateResult = await UsersCollection.updateOne(
        { "_id": new ObjectId(databaseUsers[0]._id) },
        { $set: { "username": user.username, "modifiedAt": user.modifiedAt } }
      );
      if (updateResult.modifiedCount === 1) {
        return res.status(200).json(res.locals.responseMessages.usernameChangeSuccessful(user.username));
      } else {
        throw new Error("Nothing was modified");
      }
    } catch (error) {
      console.log(error);
      return res.status(503).json(res.locals.responseMessages.generalError());
    }
  }

  private async validateUploadImage(req: any, res: Response, next: NextFunction) {
    try {
      parseFile(req, res, (err) => {
        if (err) {
          // file size too large. The client side validation SHOULD keep this route clean of any files that are not image.
          return res.status(413).json(res.locals.responseMessages.profilePictureUploadFailedFileToBig());
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
        return res.status(415).json(res.locals.responseMessages.profilePictureUploadFailedUnsupportedType());
     });
    } catch (error) {
      console.log(error);
      return res.status(503).json(res.locals.responseMessages.generalError());
    }
  }

  private async storeUploadedImageInDatabase(req: any, res: Response) {
    try {
      const updatedProfile = await UsersCollection.findOneAndUpdate(
        { "_id": new ObjectId(res.locals.token.id) },
        { $set: { "profileImage": res.locals.image } }
      );
      if (updatedProfile.lastErrorObject.updatedExisting && updatedProfile.lastErrorObject.n === 1) {
        return res.status(200).json(res.locals.responseMessages.changeProfilePictureSuccessful());
      } else {
        throw new Error("Updating user profile picture didn't work");
      }
    } catch (error) {
      console.log(error);
      return res.status(503).json(res.locals.responseMessages.generalError());
    }
  }
}
