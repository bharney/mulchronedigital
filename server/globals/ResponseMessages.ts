import { JsonWebTokenWorkers, CreateJsonWebTokenKeyPairResult } from "../security/JsonWebTokenWorkers";
import { User } from "../models/User";
import { UsersCollection } from "../config/master";
import { ObjectId } from "mongodb";
import errorLogger from "../logging/ErrorLogger";

export class ResponseMessages {

  public static userNameIsNotValid(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "You must enter a username between 4 and 12 characters long"
      };
      resolve(message);
    });
  }

  public static passwordIsNotValid(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "Your password must be atleast 8 characters with one upper case letter, one lower case letter, one number, and one special character"
      };
      resolve(message);
    });
  }

  public static resetPasswordTokenNotValid(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "The reset token was invalid"
      };
      resolve(message);
    });
  }

  public static resetPasswordTokenIpAddressDoNotMatch(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "Sorry, for security purposes you are only allowed to reset your password from the same IP address you requested it from."
      };
      resolve(message);
    });
  }

  public static tokenPasswordNotValid(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "The token password you entered is not valid"
      };
      resolve(message);
    });
  }

  public static userIsNotActive(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": `Your user account is not activate, if you have previously activated this account your access may have been revoked.`,
        "relogin": true,
      };
      resolve(message);
    });
  }

  public static userIsNotAdmin(): Promise<object> {
    return new Promise(resolve => {
      const messaage = {
        "status": false,
        "message": "The user account is not an admin, if you previously had admin access your access maybe have been revoked",
        "relogin": true
      };
      resolve(messaage);
    });
  }

  public static emailIsNotValid(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "You must enter a valid email address"
      };
      resolve(message);
    });
  }

  public static usernameIsTaken(username: string): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": `The username ${username} is already taken`
      };
      resolve(message);
    });
  }

  public static emailIsTaken(email: string): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": `The email ${email} is already associated with an account.`
      };
      resolve(message);
    });
  }

  public static userRegistrationSuccessful(username: string, email: string): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": true,
        "message": `Thanks for registering ${username}! We have sent a email to ${email} so we can verify your account. 
                    You must click the link in this email to active your account.`
      };
      resolve(message);
    });
  }

  public static generalError(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "Something went wrong on our end, please try again in a moment."
      };
      resolve(message);
    });
  }

  public static noSymmetricKeyProvidedError(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "There was no symmetric key provided for the request body."
      };  
      resolve(message);
    });
  }

  public static noEncrypteRequestBodyTextError(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "There was no encrypted text body provided"
      };  
      resolve(message);
    });
  }

  public static invalidSymmetricKeyProvidedError(): Promise<object> {
    return new Promise(resolve => {
      const message = {
          "status": false,
          "message": "The symmetric key provided did not pass the validation process"
      };
      resolve(message);
    });
  }

  public static noUserFound(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "Sorry, we did not find any users with that email address.",
        "relogin": true
      };
      resolve(message);
    });
  }

  public static noUserFoundThatIsActive(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "Sorry, we did not find any users with that email address that are currently active.",
        "relogin": true
      };
      resolve(message);
    });
  }

  public static passwordsDoNotMatch(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "Sorry the password you entered does not match the one stored."
      };
      resolve(message);
    });
  }

  public static noJsonWebTokenInHeader(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "No token in header",
        "relogin": true
      };
      resolve(message);
    });
  }

  public static jsonWebTokenExpired(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "Please verify your login information again please.",
        "relogin": true
      };
      resolve(message);
    });
  }

  public static jsonWebTokenDoesntMatchStoredToken(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "Please verify your login information again please",
        "relogin": true
      };
      resolve(message);
    });
  }

  public static async successfulUserLogin(databaseUser: User): Promise<object> {
    try {
      const tokenCreateResult: CreateJsonWebTokenKeyPairResult = await JsonWebTokenWorkers.createJsonWebTokenKeyPairForUser(databaseUser);
      const updatedProfile = await UsersCollection.updateOne(
        { _id: new ObjectId(databaseUser._id) },
        { $set: { jsonToken: tokenCreateResult.token, jsonWebTokenPrivateKey: tokenCreateResult.privateKey, jsonWebTokenPublicKey: tokenCreateResult.publicKey } }
      );
      if (updatedProfile.result.nModified === 1 && updatedProfile.result.n === 1) {
        const message = {
          "status": true,
          "message": `Welcome back ${databaseUser.username}`,
          "token": tokenCreateResult.token
        };
        return message;
      } else {
        throw new Error("Updating user token didn't work");
      }
    } catch (error) {
      errorLogger.error(error);
    }
  }

  public static dashboardUserFound(databaseUser: User): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": true,
        "username": databaseUser.username,
        "profileImage": databaseUser.profileImage.secure_url
      };
      resolve(message);
    });
  }

  public static userChangedPasswordSuccessfully(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": true,
        "message": "You have successfully changed your password"
      };
      resolve(message);
    });
  }

  public static usernameChangeSuccessful(newUsername): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": true,
        "message": `You have successfully changed your username to ${newUsername}`
      };
      resolve(message);
    });
  }

  public static profilePictureUploadFailedUnsupportedType(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "Uploading your profile failed, please try a different image type."
      };
      resolve(message);
    });
  }

  public static changeProfilePictureSuccessful(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": true
      };
      resolve(message);
    });
  }

  public static userAccountNotActive(username: string): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": `The account for ${username} currently isn't active. If you just registered, an email is on its way. If this account isn't new your access has been revoked.`
      };
      resolve(message);
    });
  }

  public static userAccountActiveSuccess(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": true,
        "message": `Thanks for activating your account`
      };
      resolve(message);
    });
  }

  public static forgotPasswordSuccess(email: string): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": true,
        "message": `We have sent an email to ${email}, with instructions on how to restart your password`
      };
      resolve(message);
    });
  }

  public static tooManyForgotPasswordRequests(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": "We have recently sent you a forgot password token, you are only allowed one a day"
      };
      resolve(message);
    });
  }

  public static contactMeSucess(userName: string, userEmail: string): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": true,
        "message": `Thanks for the email ${userName}. I will do my best to response to you at ${userEmail} as soon as possible.`
      };
      resolve(message);
    });
  }

  public static contactMeNameNotLongEnough(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": `The name you entered in the contact me form was not long enough`
      };
      resolve(message);
    });
  }

  public static contactMeMessageNotLongEnough(): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": false,
        "message": `The message you entered was not long enough`
      };
      resolve(message);
    });
  }

  public static successfulGetUsersForAdminDashboard(users: User[]): Promise<object> {
    return new Promise(resolve => {
      const message = {
        "status": true,
        "users": users
      };
      resolve(message);
    });
  }
}
