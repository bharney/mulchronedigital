import { JsonWebTokenWorkers } from "../security/JsonWebTokenWorkers";
import { User } from "../models/user";

export class ResponseMessages {

  public userNameIsNotValid(): object {
    return {
      "status": false,
      "message": "You must enter a username between 4 and 12 characters long"
    };
  }

  public passwordIsNotValid(): object {
    return {
      "status": false,
      "message": "Your password must be atleast 8 characters with one upper case letter, one lower case letter, one number, and one special character"
    };
  }

  public emailIsNotValid(): object {
    return {
      "status": false,
      "message": "You must enter a valid email address"
    };
  }

  public usernameIsTaken(username: string): object {
    return {
      "status": false,
      "message": `Sorry, but the username ${username} is already in use by one of our users`
    };
  }

  public emailIsTaken(email: string): object {
    return {
      "status": false,
      "message": `Sorry, but the email ${email} is already in use by by one of our users`
    };
  }

  public userRegistrationSuccessful(username: string): object {
    return {
      "status": true,
      "message": `Thanks for registering ${username}!`
    };
  }

  public generalError(): object {
    return {
      "status": false,
      "message": "Something went wrong on our end, please give a moment and try again"
    };
  }

  public noUserFound(): object {
    return {
      "status": false,
      "message": "Sorry, we did not find any users with that email address"
    };
  }

  public passwordsDoNotMatch(): object {
    return {
      "status": false,
      "message": "Sorry the password you entered does not match the one stored"
    };
  }

  public noJsonWebTokenInHeader(): object {
    return {
      "status": false,
      "message": "Please login in before trying to access your dashboard"
    };
  }

  public jsonWebTokenExpired(): object {
    return {
      "status": false,
      "message": "Please verify your login information again please",
      "token": null
    };
  }

  public async successfulUserLogin(databaseUser: User): Promise<object> {
    try {
      const token = await JsonWebTokenWorkers.signSignWebToken(databaseUser._id, databaseUser.isAdmin);
      const message = {
        "status": true,
        "message": `Welcome back ${databaseUser.username}`,
        "token": token
      };
      return message;
    } catch (error) {
      // TODO: retry or send user error message?
      throw error;
    }
  }
}
