import * as cloudinary from "cloudinary";

export class Cloudinary {
    constructor() {
        cloudinary.config({
            cloud_name: "dqukwohgi",
            api_key: "726712423623842",
            api_secret: "NLPoIfTZykRrw0ZC55TQaWFdu8s"
        });
    }

    public deleteCloudinaryImage(cloudinaryImageId: string): void {
        cloudinary.v2.uploader.destroy(cloudinaryImageId, {invalidate: true }, function(error, result) {
            if (error) {
                // todo: if there is an error we need to throw something into a RabbitMQ queue that will attempt to delete it.
            }
            // dont need to worry about returning anything, the user's response is not dependant on the deletion of their user image from thier CDN.
        });
    }

    public async uploadCloudinaryImage(fileBuffer: Buffer): Promise<object> {
        return new Promise((resolve, reject) => {
            console.log(fileBuffer);
            cloudinary.v2.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                if (error) {
                    reject(false);
                }
                resolve(result);
            }).end(fileBuffer);
        });
    }
}
