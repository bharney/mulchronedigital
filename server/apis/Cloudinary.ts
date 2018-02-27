import * as cloudinary from "cloudinary";
import errorLogger from "../logging/ErrorLogger";

export class Cloudinary {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    public deleteCloudinaryImage(cloudinaryImageId: string): void {
        cloudinary.v2.uploader.destroy(cloudinaryImageId, {invalidate: true }, function(error, result) {
            if (error) {
                errorLogger.error(error);
                // todo: if there is an error we need to throw something into a RabbitMQ queue that will attempt to delete it.
            }
            // dont need to worry about returning anything, the user's response is not dependant on the deletion of their user image from thier CDN.
        });
    }

    public async uploadCloudinaryImage(fileBuffer: Buffer): Promise<object> {
        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                if (error) {
                    errorLogger.error(error);
                    reject(false);
                }
                resolve(result);
            }).end(fileBuffer);
        });
    }
}
