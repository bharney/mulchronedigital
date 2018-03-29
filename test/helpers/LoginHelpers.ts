import { AESEncryptionResult, Encryption } from "../../shared/Encryption";
import { LoginUser } from "../../client/app/shared/models/user-authenication.model";

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
}