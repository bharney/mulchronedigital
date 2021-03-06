import { ObjectId } from "mongodb";

export class UserAction {
    public userId: ObjectId;
    public ip: string;
    public actionType: string;
    public happenedAt: string;
    public oldPassword?: string;
    public oldUsername?: string;
    public forgotPasswordTokenId?: ObjectId;

    constructor(userId: string, ip: string, actionType: string) {
        this.userId = new ObjectId(userId);
        this.ip = ip;
        this.actionType = actionType;
        this.happenedAt = new Date().toLocaleString();
    }
}

export class UserLoggedInAction extends UserAction {

    constructor(userId: string, ip: string, actionType: string) {
        super(userId, ip, actionType);
    }
}

export class UserChangedPasswordAction extends UserAction {

    constructor(userId: string, ip: string, actionType: string, oldPassword: string) {
        super(userId, ip, actionType);
        this.oldPassword = oldPassword;
    }
}

export class UserChangedUsernameAction extends UserAction {

    constructor(userId: string, ip: string, actionType: string, oldUsername: string) {
        super(userId, ip, actionType);
        this.oldUsername = oldUsername;
    }
}

export class UserForgotPasswordAction extends UserAction {

    constructor(userId: string, ip: string, actionType: string, forgotPasswordTokenId: string) {
        super(userId, ip, actionType);
        this.forgotPasswordTokenId = new ObjectId(forgotPasswordTokenId);
    }
}
