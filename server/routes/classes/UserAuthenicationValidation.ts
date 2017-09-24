export class UserAuthenicationValidation {

    public static isUserNameValid(username: string): Promise<boolean> {
        return new Promise(resolve => {
            (username.length < 4 || username.length > 12) ? resolve(false) : resolve(true);
        });
    }

    public static isPasswordValid(password: string): Promise<boolean> {
        return new Promise(resolve => {
            const passwordRegex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            (passwordRegex.test(password)) ? resolve(true) : resolve(false);
        });
    }

    public static isEmailValid(email: string): Promise<boolean> {
        return new Promise(resolve => {
            const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            (emailRegex.test(email)) ? resolve(true) : resolve(false);
        });
    }
}
