export class ContactMe {
    public userName: string;
    public userEmail: string;
    public message: string;

    constructor(userName: string, userEmail: string, message: string) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.message = message;
    }
}
