import { UserActionHelper } from "../../helpers/UserActionHelper";
import { HttpHelpers } from "../../globals/HttpHelpers";
import { UserDashboardDataAccess } from "../../data-access/UserDashboardDataAccess";
import { User } from "../../models/user";
import { Database } from "../../globals/Database";
import { BaseRouter } from "../classes/BaseRouter";
import { Router, Request, Response, NextFunction } from "express";
import { JsonWebTokenWorkers } from "../../security/JsonWebTokenWorkers";
import { JsonWebToken } from "../../../shared/JsonWebToken";
import { ObjectId } from "mongodb";
import { UserAuthenicationValidator } from "../../../shared/UserAuthenicationValidator";
import * as multer from "multer";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { Cloudinary } from "../../apis/Cloudinary";
import { UserAuthenicationDataAccess } from "../../data-access/UserAuthenicationDataAccess";

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
    this.router.use("/changepassword", this.decryptRequestBody);
    this.router.patch("/changepassword", this.validateUserChangePassword);

    // change username
    this.router.use("/changeusername", this.checkForUserJsonWebToken);
    this.router.use("/changeusername", this.decryptRequestBody);
    this.router.patch("/changeusername", this.validateUserChangeUsername);

    // upload profile image
    this.router.use("/changeprofileimage", this.checkForUserJsonWebToken);
    this.router.use("/changeprofileimage", this.parseImageUpload);
    this.router.use("/changeprofileimage", this.validateImageUpload);
    this.router.patch("/changeprofileimage", this.storeUploadedImageInDatabase);

    // update users geolocation image
    this.router.use("/updateuserlocation", this.checkForUserJsonWebToken);
    this.router.patch("/updateuserlocation", this.updateUserLocationInformation);
  }

  private async getUserInformation(req: Request, res: Response, next: NextFunction) {
    try {
      const databaseUsers: User[] = await UserDashboardDataAccess.getUserDashboardInformation(res.locals.token.id);
      if (databaseUsers.length <= 0) {
        return res.status(503).json(ResponseMessages.generalError());
      }
      // we are looking by object id there should only be one user in this array.
      return res.status(200).json(ResponseMessages.dashboardUserFound(databaseUsers[0]));
    } catch (error) {
      res.status(503).json(ResponseMessages.generalError());
      return next(error);
    }
  }

  private async validateUserChangePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!await UserAuthenicationValidator.isPasswordValid(req.body.currentPassword) || !await UserAuthenicationValidator.isPasswordValid(req.body.newPassword)) {
        return res.status(422).json(ResponseMessages.passwordIsNotValid());
      }
      // TODO: abstract this chunk of code, it is going to be come extremely redundant.
      const databaseUsers: User[] = await UserDashboardDataAccess.getUserPassword(res.locals.token.id);
      if (databaseUsers.length <= 0) {
        return res.status(422).json(ResponseMessages.noUserFound());
      }
      if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(req.body.currentPassword, databaseUsers[0].password)) {
        return res.status(401).json(ResponseMessages.passwordsDoNotMatch());
      }
      const user = new User(databaseUsers[0].username, databaseUsers[0].email, req.body.newPassword);
      const updatePasswordResult = await UserDashboardDataAccess.updateUserPassword(databaseUsers[0]._id, user);
      if (updatePasswordResult.modifiedCount === 1) {
        res.status(200).json(ResponseMessages.userChangedPasswordSuccessfully());
        const httpHelpers = new HttpHelpers();
        const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
        const userActions = new UserActionHelper();
        await userActions.userChangedPassword(databaseUsers[0]._id, ip, databaseUsers[0].password);
      } else {
        throw new Error("There was nothing updated when attemtping to update the users password");
      }
    } catch (error) {
      res.status(503).json(ResponseMessages.generalError());
      return next(error);
    }
  }

  private async validateUserChangeUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const newUsername = req.body.newUsername;
      const password = req.body.password;
      const userId = res.locals.token.id;
      if (!await UserAuthenicationValidator.isUserNameValid(newUsername)) {
        return res.status(422).json(ResponseMessages.userNameIsNotValid());
      }
      if (!await UserAuthenicationValidator.isPasswordValid(password)) {
        return res.status(422).json(ResponseMessages.passwordIsNotValid());
      }
      const existingUsers: User[] = await UserDashboardDataAccess.findIfUserExistsByUsername(newUsername);
      if (existingUsers.length > 0) {
        return res.status(409).json(ResponseMessages.usernameIsTaken(newUsername));
      }
      const databaseUsers: User[] = await UserDashboardDataAccess.findUserPasswordAndUsernameById(userId);
      if (databaseUsers.length <= 0) {
        return res.status(422).json(ResponseMessages.noUserFound());
      }
      if (!await UserAuthenicationValidator.comparedStoredHashPasswordWithLoginPassword(password, databaseUsers[0].password)) {
        return res.status(401).json(ResponseMessages.passwordsDoNotMatch());
      }
      const oldUsername = databaseUsers[0].username;
      const user = new User(req.body.newUsername);
      const updateResult = await UserDashboardDataAccess.modifiyUsernameByUserId(userId, user);
      if (updateResult.modifiedCount === 1) {
        res.status(200).json(ResponseMessages.usernameChangeSuccessful(user.username));
        const httpHelpers = new HttpHelpers();
        const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
        const actionHelpers = new UserActionHelper();
        await actionHelpers.userChangedUsername(userId, ip, oldUsername);
      } else {
        throw new Error("Nothing was modified");
      }
    } catch (error) {
      res.status(503).json(ResponseMessages.generalError());
      return next(error);
    }
  }

  private async parseImageUpload(req: any, res: Response, next: NextFunction) {
    try {
      const parseFile = multer({
        limits: { fileSize: 5000000, files: 1 }
      }).single("image");
      parseFile(req, res, err => {
        if (err) {
          // file size too large. The client side validation SHOULD keep this route clean of any files that are not an image.
          res.status(413).json(ResponseMessages.generalError());
        }
        res.locals.image = req.file;
        next();
      });
    } catch (error) {
      res.status(503).json(ResponseMessages.generalError());
      return next(error);
    }
  }

  private async validateImageUpload(req: Request, res: Response, next: NextFunction) {
    try {
      const imageFileExtensions: string[] = ["png", "jpg", "jpeg", "gif"];
      const imageTypeArray = res.locals.image.mimetype.split("/");
      const imageType = imageTypeArray[1];
      for (let i = 0; i < imageFileExtensions.length; i++) {
        if (imageType === imageFileExtensions[i]) {
          const user: User = await UserDashboardDataAccess.getUserProfileImageInformationByUserId(res.locals.token.id);
          const cloudinary = new Cloudinary();
          const profileImage = await cloudinary.uploadCloudinaryImage(res.locals.image.buffer);
          if (profileImage) {
            if (typeof (user.profileImage) !== "undefined" && typeof (user.profileImage.secure_url) !== "undefined" && typeof (user.profileImage.public_id) !== "undefined") {
              cloudinary.deleteCloudinaryImage(user.profileImage.public_id);
            }
            res.locals.image = profileImage;
            next();
            return;
          } else {
            throw new Error("Upload to cloudinary failed");
          }
        }
      }
      // Unsupported Media Type
      return res.status(415).json(ResponseMessages.profilePictureUploadFailedUnsupportedType());
    } catch (error) {
      res.status(503).json(ResponseMessages.generalError());
      return next(error);
    }
  }

  private async storeUploadedImageInDatabase(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedProfile = await UserDashboardDataAccess.updateUserProfileImage(res.locals.token.id, res.locals.image);
      if (updatedProfile.lastErrorObject.updatedExisting && updatedProfile.lastErrorObject.n === 1) {
        return res.status(200).json(ResponseMessages.changeProfilePictureSuccessful());
      } else {
        throw new Error("Updating user profile picture didn't work");
      }
    } catch (error) {
      res.status(503).json(ResponseMessages.generalError());
      return next(error);
    }
  }

  private async updateUserLocationInformation(req: Request, res: Response, next: NextFunction) {
    try {
      const latitude = req.body.latitude;
      const longitude = req.body.longitude;
      if (typeof latitude !== "number" || typeof longitude !== "number") {
        return res.status(409).json(ResponseMessages.generalError());
      }
      const httpHelpers = new HttpHelpers();
      const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
      const userAgent = await httpHelpers.getUserAgentFromRequestObject(req.headers);
      const userId = res.locals.token.id;
      const updatedProfile = await UserDashboardDataAccess.updateUserLocationForIpAddress(userId, ip, latitude, longitude, userAgent);
      if (updatedProfile.result.n === 1) {
        return res.status(200);
      } else {
        throw new Error("Updating user location information didn't work");
      }
    } catch (error) {
      res.status(503).json(ResponseMessages.generalError());
      return next(error);
    }
  }
}
