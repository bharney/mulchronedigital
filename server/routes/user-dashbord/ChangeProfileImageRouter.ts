import { Router, Request, Response, NextFunction } from "express";
import { BaseRouter } from "../classes/BaseRouter";
import * as multer from "multer";
import { ResponseMessages } from "../../globals/ResponseMessages";
import { UserDashboardDataAccess } from "../../data-access/UserDashboardDataAccess";
import { User } from "../../models/User";
import { Cloudinary } from "../../apis/Cloudinary";

export default class ChangeProfileImageRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router.use("/", this.checkForUserJsonWebToken);
        this.router.use("/", this.parseImageUpload);
        this.router.use("/", this.validateImageUpload);
        this.router.patch("/", this.storeUploadedImageInDatabase);
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
}
