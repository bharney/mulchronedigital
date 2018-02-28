import { ObjectId } from "mongodb";
import errorLogger from "../logging/ErrorLogger";
import bcrypt = require("bcryptjs");

export class ForgotPasswordToken {
    public userId: ObjectId;
    public createdAt: Date;
    public validUntil: Date;
    public tokenPassword: string;
    public ip: string;

    constructor(userId: string, ip: string) {
        this.userId = new ObjectId(userId);
        const now = new Date();
        this.createdAt = now;
        const tomorrow = new Date(now.setDate(now.getDate() + 1));
        this.validUntil = tomorrow;
        this.ip = ip;
    }

    public async securePassword(newPassword: string): Promise<boolean> {
        try {
            this.tokenPassword = await this.HashPassword(newPassword);
            return true;
        } catch (error) {
            errorLogger.error(error);
            return false;
        }
    }

    // TODO: through this in a helper class or something
    private HashPassword(newPassword: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10)
                .then(salt => {
                    return bcrypt.hash(newPassword, salt);
                })
                .then(hashedPassword => {
                    resolve(hashedPassword);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}
