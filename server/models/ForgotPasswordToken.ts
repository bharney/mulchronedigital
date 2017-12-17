import { ObjectId } from "mongodb";

export class ForgotPasswordToken {
    public userId: ObjectId;
    public createdAt: string;
    public validUntil: string;

    constructor(userId: ObjectId) {
        this.userId = userId;
        const now = new Date();
        this.createdAt = now.toLocaleString();
        const tomorrow = new Date(now.setDate(now.getDate() + 1)).toLocaleString();
        this.validUntil = tomorrow;
    }
}
