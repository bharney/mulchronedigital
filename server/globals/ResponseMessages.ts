import { JsonWebTokenWorkers } from "../security/JsonWebTokenWorkers";
import { User } from "../models/user";
import { UsersCollection } from "../master";
import { ObjectId } from "mongodb";

export class ResponseMessages {

  public static userNameIsNotValid(): object {
    return {
      "status": false,
      "message": "You must enter a username between 4 and 12 characters long"
    };
  }

  public static passwordIsNotValid(): object {
    return {
      "status": false,
      "message": "Your password must be atleast 8 characters with one upper case letter, one lower case letter, one number, and one special character"
    };
  }

  public static userIsNotActive(): object {
    return {
      "status": false,
      "message": `Your user account is not activate, if you have previously activated this account your access may have been revoked.`,
      "relogin": true,
    };
  }

  public static emailIsNotValid(): object {
    return {
      "status": false,
      "message": "You must enter a valid email address"
    };
  }

  public static usernameIsTaken(username: string): object {
    return {
      "status": false,
      "message": `The username ${username} is already taken`
    };
  }

  public static emailIsTaken(email: string): object {
    return {
      "status": false,
      "message": `The email ${email} is already associated with an account.`
    };
  }

  public static userRegistrationSuccessful(username: string, email: string): object {
    return {
      "status": true,
      "message": `Thanks for registering ${username}! We have sent a email to ${email} so we can verify your account. 
                  You must click the link in this email to active your account.`
    };
  }

  public static generalError(): object {
    return {
      "status": false,
      "message": "Something went wrong on our end, please try again in a moment."
    };
  }

  public static noUserFound(): object {
    return {
      "status": false,
      "message": "Sorry, we did not find any users with that email address.",
      "relogin": true
    };
  }

  public static noUserFoundThatIsActive(): object {
    return {
      "status": false,
      "message": "Sorry, we did not find any users with that email address that are currently active.",
      "relogin": true
    };
  }

  public static passwordsDoNotMatch(): object {
    return {
      "status": false,
      "message": "Sorry the password you entered does not match the one stored."
    };
  }

  public static noJsonWebTokenInHeader(): object {
    return {
      "status": false,
      "message": "No token in header",
      "relogin": true
    };
  }

  public static jsonWebTokenExpired(): object {
    return {
      "status": false,
      "message": "Please verify your login information again please.",
      "relogin": true
    };
  }

  public static jsonWebTokenDoesntMatchStoredToken(): object {
    return {
      "status": false,
      "message": "Please verify your login information again please",
      "relogin": true
    };
  }

  public static async successfulUserLogin(databaseUser: User): Promise<object> {
    try {
      const token = await JsonWebTokenWorkers.signSignWebToken(databaseUser._id, databaseUser.isAdmin, databaseUser.publicKeyPairOne, databaseUser.privateKeyPairTwo);
      const updatedProfile = await UsersCollection.findOneAndUpdate(
        { _id: new ObjectId(databaseUser._id) },
        { $set: { "jsonToken": token } }
      );
      if (updatedProfile.lastErrorObject.updatedExisting && updatedProfile.lastErrorObject.n === 1) {
        const message = {
          "status": true,
          "message": `Welcome back ${databaseUser.username}`,
          "token": token
        };
        return message;
      } else {
        throw new Error("Updating user token didn't work");
      }
    } catch (error) {
      // TODO: retry or send user error message?
      throw error;
    }
  }

  public static dashboardUserFound(databaseUser: User): object {
    return {
      "status": true,
      "username": databaseUser.username,
      "profileImage": databaseUser.profileImage.secure_url
    };
  }

  public static userChangedPasswordSuccessfully(): object {
    return {
      "status": true,
      "message": "User changed password successfully"
    };
  }

  public static usernameChangeSuccessful(newUsername): object {
    return {
      "status": true,
      "message": `You have successfully changed your username to ${newUsername}`
    };
  }

  public static profilePictureUploadFailedFileToBig(): object {
    return {
      "status": false,
      "message": "Uploading your profile failed, please make sure that your file does not exceed 5MB in size."
    };
  }

  public static profilePictureUploadFailedUnsupportedType(): object {
    return {
      "status": false,
      "message": "Uploading your profile failed, please try a different image type."
    };
  }

  public static changeProfilePictureSuccessful(): object {
    return {
      "status": true
    };
  }

  public static userAccountNotActive(username: string) {
    return {
      "status": false,
      "message": `The account for ${username} currently isn't active. If you just registered, an email is on its way. If this account isn't new your access has been revoked.`
    };
  }

  public static userAccountActiveSuccess() {
    return {
      "status": true,
      "message": `Thanks for activating your account`
    };
  }

  public static forgotPasswordSuccess(email: string): object {
    return {
      "status": true,
      "message": `We have sent an email to ${email}, with instructions on how to restart your password`
    };
  }

  public static tooManyForgotPasswordRequests(): object {
    return {
      "status": false,
      "message": "We have recently sent you a forgot password token, you are only allowed one a day"
    };
  }
}
