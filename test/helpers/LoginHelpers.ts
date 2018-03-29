import { AESEncryptionResult, Encryption } from "../../shared/Encryption";
import { LoginUser, RegisterUser } from "../../client/app/shared/models/user-authenication.model";

export default class LoginHelpers {
    public static async createLoginUserObject (userPassword: string, userEmail: string): Promise<AESEncryptionResult>  {
        try {
            const loginUserObject: string = JSON.stringify(new LoginUser(userPassword, userEmail));
            const encryptedObject: AESEncryptionResult = await Encryption.AESEncrypt(loginUserObject);
            return encryptedObject;
        } catch (error) {
            return new AESEncryptionResult(false, null, null);
        }
    }

    public static async createRegisterUserObject(username: string, email: string, password: string): Promise<AESEncryptionResult> {
        try {
            const registerUserObject: string = JSON.stringify(new RegisterUser(username, email, password));
            const encryptedObject: AESEncryptionResult = await Encryption.AESEncrypt(registerUserObject);
            return encryptedObject;
        } catch (error) {
            return new AESEncryptionResult(false, null, null);
        }
    }
}