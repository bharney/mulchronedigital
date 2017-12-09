import { ObjectId } from "mongodb";

export class UserAction {
    public userId: ObjectId;
    public ip: string;
    public actionType: string;
    public happenedAt: string;
    public oldPassword?: string;
    public oldUsername?: string;

    constructor(userId: ObjectId, ip: string, actionType: string) {
        this.userId = userId;
        this.ip = ip;
        this.actionType = actionType;
        this.happenedAt = new Date().toLocaleString();
    }
}

export class UserLoggedIn extends UserAction {

    constructor(userId: ObjectId, ip: string, actionType: string) {
        super(userId, ip, actionType);
    }
}

export class UserChangedPassword extends UserAction {

    constructor(userId: ObjectId, ip: string, actionType: string, oldPassword: string) {
        super(userId, ip, actionType);
        this.oldPassword = oldPassword;
    }
}

export class UserChangedUsername extends UserAction {

    constructor(userId: ObjectId, ip: string, actionType: string, oldUsername: string) {
        super(userId, ip, actionType);
        this.oldUsername = oldUsername;
    }
}
