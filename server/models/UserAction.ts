import { ObjectId } from "mongodb";


export class UserAction {
    public userId: ObjectId;
    public ip: string;
    public actionType: string;
    public happenedAt: string;

    constructor(userId: ObjectId, ip: string, actionType: string) {
        this.userId = userId;
        this.ip = ip;
        this.actionType = actionType;
        this.happenedAt = new Date().toString();
    }
}
