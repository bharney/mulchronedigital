#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: "dqukwohgi",
    api_key: "726712423623842",
    api_secret: "NLPoIfTZykRrw0ZC55TQaWFdu8s"
});

const distDir = path.join(__dirname, "../dist/");

const readDirectory = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(filePath, (error, result) => {
            if (error)
                reject(error);
            resolve(result);
        });
    });
};

const combineDistDir = (filePath) => {
    return distDir + filePath;
};

const areAnyOfTheFilesInTheDirectoryADirectory = (files) => {
    if (files.length <= 0)
        throw new Error("No files are located in that directory");

    for (let i = 0; i < files.length; i++) {
        if (files[i].includes(".") && !files[i].includes("gitkeep")) {
            console.log(files);
            uploadFileToCloudinary(files[i]);
        } else {
            
        }
    }
};

const uploadFileToCloudinary = (filePath) => {
    const fullPathToDirectory = combineDistDir(filePath);
    const readStream = fs.createReadStream(fullPathToDirectory, "utf-8");
    let data = "";
    let dataBuffer = "";
    readStream.on("data", (chunk) => {
        data += chunk;
    });
    readStream.on("end", () => {
        dataBuffer = new Buffer.from(data);
        cloudinary.v2.uploader.upload_stream({ public_id: filePath, resource_type: "raw" }, (error, result) => {
            if (error) {
                throw new Error(error);
            }
            storeCloudinaryObjectToFileSystem(result);
        }).end(dataBuffer);
    });
};

const storeCloudinaryObjectToFileSystem = (cloudinaryObject) => {
    readStoredCloudinaryObjects()
        .then(result => {
            if (cloudinaryObject)
                result.objects.push(cloudinaryObject);
            return writeNewCloudinaryObjectToDisk(result);
        })
        .then(result => {
            // console.log(result);
        })
        .catch(error => {
            throw new Error(error);
        });
};

const readStoredCloudinaryObjects = () => {
    return new Promise((resolve, reject) => {
        const jsonFile = path.join(__dirname, "./json/cloudinary-files.json");
        const readStream = fs.createReadStream(jsonFile);
        let data = "";
        readStream.on("data", (chunk) => {
            data += chunk;
        });
        readStream.on("end", () => {
            resolve(JSON.parse(data));
            readStream.close();
        });
    });
};

const writeNewCloudinaryObjectToDisk = (json) => {
    return new Promise((resolve, reject) => {
        try {
            const jsonFile = path.join(__dirname, "./json/cloudinary-files.json");
            const writeStream = fs.createWriteStream(jsonFile);
            writeStream.write(JSON.stringify(json));
            writeStream.close();
            resolve(true);
        } catch (error) {
            reject(false);
        }
    });
};

const deleteCloudinaryImage = (cloudinaryImageId) => {
    cloudinary.v2.uploader.destroy(cloudinaryImageId, { resource_type: "raw", invalidate: true }, function (error, result) {
        if (error) {
            throw error;
            // todo: if there is an error we need to throw something into a RabbitMQ queue that will attempt to delete it.
        }
        console.log(result);
        // dont need to worry about returning anything, the user's response is not dependant on the deletion of their user image from thier CDN.
    });
};


readDirectory(distDir)
    .then((files) => {
        return areAnyOfTheFilesInTheDirectoryADirectory(files);
    })
    .catch(error => {
        throw new Error(error);
    });

 //deleteCloudinaryImage("hjr7frc5moimmzzzefz7");