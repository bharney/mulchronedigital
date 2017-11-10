import { UserDashboardDataAccess } from "../../data-access/UserDashboardDataAccess";
import { User } from "../../models/user";
import { Database } from "../../globals/Database";
import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { JsonWebToken } from "../../../shared/interfaces/IJsonWebToken";
import { ObjectId } from "mongodb";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import * as multer from "multer";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { UsersCollection } from "../../cluster/master";
const parseFile = multer({
  limits: { fileSize: 5000000, files: 1 }
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
    this.router.use("/getuserinformation", this.checkForUserJsonWebToken);
    this.router.get("/getuserinformation", this.getUserInformation);

    // change user password
    this.router.use("/changepassword", this.checkForUserJsonWebToken);
    this.router.patch("/changepassword", this.validateUserChangePassword);

    // change username
    this.router.use("/changeusername", this.checkForUserJsonWebToken);
    this.router.patch("/changeusername", this.validateUserChangeUsername);

    // upload profile image
    this.router.use("/changeprofileimage", this.checkForUserJsonWebToken);
    this.router.use("/changeprofileimage", this.validateUploadImage);
    this.router.patch("/changeprofileimage", this.storeUploadedImageInDatabase);

    // update users geolocation image
    this.router.use("/updateuserlocation", this.checkForUserJsonWebToken);
    this.router.patch("/updateuserlocation", this.updateUserLocationInformation);
  }

  private async getUserInformation(req: Request, res: Response) {
    const responseMessages = new ResponseMessages();
    try {
      const userdashboardDataAccess = new UserDashboardDataAccess();
      const databaseUsers: User[] = await userdashboardDataAccess.getUserDashboardInformation(res.locals.token.id);
      if (databaseUsers.length <= 0) {
        return res.status(503).json(responseMessages.generalError());
      }
      // we are looking by object id there should only be one user in this array.
      return res.status(200).json(responseMessages.dashboardUserFound(databaseUsers[0]));
    } catch (error) {
      // TOOD: log error?
      return res.status(503).json(responseMessages.generalError());
    }
  }

  private async validateUserChangePassword(req: Request, res: Response) {
    const responseMessages = new ResponseMessages();
    try {
      if (!await UserAuthenicationValidator.isPasswordValid(req.body.currentPassword) || !await UserAuthenicationValidator.isPasswordValid(req.body.newPassword)) {
        return res.status(422).json(responseMessages.passwordIsNotValid());
      }
      // TODO: abstract this chunk of code, it is going to be come extremely redundant.
      const userdashboardDataAccess = new UserDashboardDataAccess();
      const databaseUsers: User[] = await userdashboardDataAccess.getUserPassword(res.locals.token.id);
      if (databaseUsers.length <= 0) {
        return res.status(422).json(responseMessages.noUserFound());
      }
      if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(req.body.currentPassword, databaseUsers[0].password)) {
        return res.status(401).json(responseMessages.passwordsDoNotMatch());
      }
      const user = new User(databaseUsers[0].username, databaseUsers[0].email, req.body.newPassword);
      const updatePasswordResult = await userdashboardDataAccess.updateUserPassword(databaseUsers[0]._id, user);
      if (updatePasswordResult.modifiedCount === 1) {
        return res.status(200).json(responseMessages.userChangedPasswordSuccessfully());
      } else {
        throw new Error("There was nothing updated when attemtping to update the users password");
      }
    } catch (error) {
      console.log(error);
      // TOOD: log error?
      return res.status(503).json(responseMessages.generalError());
    }
  }

  private async validateUserChangeUsername(req: Request, res: Response) {
    const responseMessages = new ResponseMessages();
    try {
      if (
        !await UserAuthenicationValidator.isUserNameValid(req.body.newUsername)
      ) {
        return res.status(422).json(responseMessages.userNameIsNotValid());
      }
      if (
        !await UserAuthenicationValidator.isPasswordValid(req.body.password)
      ) {
        return res.status(422).json(responseMessages.passwordIsNotValid());
      }
      // TODO: abstract this chunk of code, it is going to be come extremely redundant.
      const existingUsers: User[] = await UsersCollection.find(
        { username: req.body.newUsername },
        { _id: 1 }
      ).toArray();
      if (existingUsers.length > 0) {
        return res
          .status(409)
          .json(responseMessages.usernameIsTaken(req.body.newUsername));
      }
      const databaseUsers: User[] = await UsersCollection.find(
        { _id: new ObjectId(res.locals.token.id) },
        { password: 1, _id: 1 }
      ).toArray();
      if (databaseUsers.length <= 0) {
        return res.status(422).json(responseMessages.noUserFound());
      }
      if (
        !await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(
          req.body.password,
          databaseUsers[0].password
        )
      ) {
        return res.status(401).json(responseMessages.passwordsDoNotMatch());
      }
      const user = new User(req.body.newUsername);
      const updateResult = await UsersCollection.updateOne(
        { _id: new ObjectId(databaseUsers[0]._id) },
        { $set: { username: user.username, modifiedAt: user.modifiedAt } }
      );
      if (updateResult.modifiedCount === 1) {
        return res
          .status(200)
          .json(responseMessages.usernameChangeSuccessful(user.username));
      } else {
        throw new Error("Nothing was modified");
      }
    } catch (error) {
      console.log(error);
      return res.status(503).json(responseMessages.generalError());
    }
  }

  private async validateUploadImage(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    const responseMessages = new ResponseMessages();
    try {
      parseFile(req, res, err => {
        if (err) {
          // file size too large. The client side validation SHOULD keep this route clean of any files that are not image.
          return res
            .status(413)
            .json(responseMessages.profilePictureUploadFailedFileToBig());
        }
        // TODO: abstract it
        const imageFileExtensions: string[] = ["png", "jpg", "jpeg", "gif"];
        const imageTypeArray = req.file.mimetype.split("/");
        const imageType = imageTypeArray[1];
        for (let i = 0; i < imageFileExtensions.length; i++) {
          if (imageType === imageFileExtensions[i]) {
            const image =
              `data:image/${imageType};base64,` +
              req.file.buffer.toString("base64");
            res.locals.image = image;
            next();
            return;
          }
        }
        // Unsupported Media Type
        return res
          .status(415)
          .json(responseMessages.profilePictureUploadFailedUnsupportedType());
      });
    } catch (error) {
      console.log(error);
      return res.status(503).json(responseMessages.generalError());
    }
  }

  private async storeUploadedImageInDatabase(req: Request, res: Response) {
    const responseMessages = new ResponseMessages();
    try {
      const updatedProfile = await UsersCollection.findOneAndUpdate(
        { _id: new ObjectId(res.locals.token.id) },
        { $set: { profileImage: res.locals.image } }
      );
      if (
        updatedProfile.lastErrorObject.updatedExisting &&
        updatedProfile.lastErrorObject.n === 1
      ) {
        return res
          .status(200)
          .json(responseMessages.changeProfilePictureSuccessful());
      } else {
        throw new Error("Updating user profile picture didn't work");
      }
    } catch (error) {
      console.log(error);
      return res.status(503).json(responseMessages.generalError());
    }
  }

  private async updateUserLocationInformation(req: Request, res: Response) {
    const responseMessages = new ResponseMessages();
    try {
      if (typeof req.body.latitude !== "number" || typeof req.body.longitude !== "number") {
        return res.status(409).json(responseMessages.generalError());
      }
      const updatedProfile = await UsersCollection.findOneAndUpdate(
        { _id: new ObjectId(res.locals.token.id) },
        { $set: { latitude: req.body.latitude, longitude: req.body.longitude } }
      );
      if (updatedProfile.lastErrorObject.updatedExisting && updatedProfile.lastErrorObject.n === 1) {
        return res.status(200);
      } else {
        throw new Error("Updating user profile picture didn't work");
      }
    } catch (error) {
      console.log(error);
      return res.status(503).json(responseMessages.generalError());
    }
  }
}
