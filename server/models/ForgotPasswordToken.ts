import { ObjectId } from "mongodb";
import errorLogger from "../logging/ErrorLogger";
import { ServerEncryption } from "../security/ServerEncryption";

export class ForgotPasswordToken {
    public userId: string;
    public createdAt: Date;
    public validUntil: Date;
    public tokenPassword: string;
    public ip: string;

    constructor(userId: string, ip: string) {
        this.userId = userId;
        this.ip = ip;
        const now = new Date();
        this.createdAt = now;
        const tomorrow = new Date(now.setDate(now.getDate() + 1));
        this.validUntil = tomorrow;
    }

    public async securePassword(newPassword: string): Promise<boolean> {
        try {
            this.tokenPassword = await ServerEncryption.HashPassword(newPassword);
            return true;
        } catch (error) {
            errorLogger.error(error);
            return false;
        }
    }
}
