import { UserActionHelper } from "../../helpers/UserActionHelper";
import { HttpHelpers } from "../../globals/HttpHelpers";
import { UserDashboardDataAccess } from "../../data-access/UserDashboardDataAccess";
import { User } from "../../models/User";
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
import { UserIpAddress } from "../classes/UserIpAddress";
import { ServerEncryption } from "../../security/ServerEncryption";
import { DnsHelpers } from "../../globals/DnsHelpers";
import GetUserInformationRouter from "./GetUserInformationRouter";
import ChangePasswordRouter from "./ChangePasswordRouter";
import ChangeUsernameRouter from "./ChangeUsernameRouter";

export class UserDashboardRouterIndex extends BaseRouter {
  public router: Router;
  private getUserInformationRouter: Router;
  private changePasswordRouter: Router;
  private changeUserNameRouter: Router;

  constructor() {
    super();
    this.router = Router();
    this.createSubRouters();
    this.configureRouter();
  }

  private createSubRouters() {
    this.getUserInformationRouter = new GetUserInformationRouter().router;
    this.changePasswordRouter = new ChangePasswordRouter().router;
    this.changeUserNameRouter = new ChangeUsernameRouter().router;
  }

  private configureRouter(): void {
    this.router.use("/getuserinformation", this.getUserInformationRouter);
    this.router.use("/changepassword", this.changePasswordRouter);
    this.router.use("/changeusername", this.changeUserNameRouter);

    // upload profile image
    this.router.use("/changeprofileimage", this.checkForUserJsonWebToken);
    this.router.use("/changeprofileimage", this.parseImageUpload);
    this.router.use("/changeprofileimage", this.validateImageUpload);
    this.router.patch("/changeprofileimage", this.storeUploadedImageInDatabase);

    // update users geolocation image
    this.router.use("/updateuserlocation", this.checkForUserJsonWebToken);
    this.router.patch("/updateuserlocation", this.updateUserLocationInformation);
  }
  private async parseImageUpload(req: any, res: Response, next: NextFunction) {
    try {
      const parseFile = multer({
        limits: { fileSize: 5000000, files: 1 }
      }).single("image");
      parseFile(req, res, async (err) => {
        if (err) {
          // file size too large. The client side validation SHOULD keep this route clean of any files that are not an image.
          return res.status(413).json(await ResponseMessages.generalError());
        } else {
          res.locals.image = req.file;
          next();
        }
      });
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
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
            if (!user.profileImage || !user.profileImage.secure_url || !user.profileImage.public_id) {
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
      return res.status(415).json(await ResponseMessages.profilePictureUploadFailedUnsupportedType());
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
  }

  private async storeUploadedImageInDatabase(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedProfile = await UserDashboardDataAccess.updateUserProfileImage(res.locals.token.id, res.locals.image);
      if (updatedProfile.lastErrorObject.updatedExisting && updatedProfile.lastErrorObject.n === 1) {
        return res.status(200).json(await ResponseMessages.changeProfilePictureSuccessful());
      } else {
        throw new Error("Updating user profile picture didn't work");
      }
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
  }

  private async updateUserLocationInformation(req: Request, res: Response, next: NextFunction) {
    try {
      const latitude = req.body.latitude;
      const longitude = req.body.longitude;
      if (typeof latitude !== "number" || typeof longitude !== "number") {
        return res.status(409).json(await ResponseMessages.generalError());
      }
      const httpHelpers = new HttpHelpers();
      const ip = await httpHelpers.getIpAddressFromRequestObject(req.ip);
      const domain = await DnsHelpers.reverseDNSLookup(ip);
      const userAgent = await httpHelpers.getUserAgentFromRequestObject(req.headers);
      const userId = res.locals.token.id;
      const updatedProfile = await UserDashboardDataAccess.updateUserLocationForIpAddress(userId, ip, domain, latitude, longitude, userAgent);
      if (updatedProfile.result.n === 1) {
        return res.status(200);
      }
      // if there was no ip address object to update, attempt to create a new one.
      const ipAdressObject = new UserIpAddress(ip, userAgent, domain, latitude, longitude);
      UserAuthenicationDataAccess.updateUserProfileIpAddresses(userId, ipAdressObject);
    } catch (error) {
      res.status(503).json(await ResponseMessages.generalError());
      return next(error);
    }
  }
}
