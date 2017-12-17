import { ObjectId } from "mongodb";

export class ForgotPasswordToken {
    public userId: ObjectId;
    public createdAt: Date;
    public validUntil: Date;

    constructor(userId: ObjectId) {
        this.userId = userId;
        const now = new Date();
        this.createdAt = now;
        const tomorrow = new Date(now.setDate(now.getDate() + 1));
        this.validUntil = tomorrow;
    }
}
