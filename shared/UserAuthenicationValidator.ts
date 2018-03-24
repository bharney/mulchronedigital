import { FormControl } from "@angular/forms";
import * as bcrypt from "bcryptjs";

export class UserAuthenicationValidator {
  public static passwordRegex: RegExp;

  public static emailValidation(control: FormControl): any {
    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if the regex test evaluates to true we will return true and the form will stop displaying the error.
    // same applies to the password validation.
    return emailRegex.test(control.value) ? null : {
      emailValidation: {
        valid: false
      }
    };
  }

  public static passwordValidation(control: FormControl): any {
    const passwordRegex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return passwordRegex.test(control.value) ? null : {
      passwordValidation: {
        valid: false
      }
    };
  }

  public static confirmPasswordValidation(control: FormControl): any {
    // compare the password for the confirm password input with the input currently in the regular password input.
    return (control.root.value["password"] === control.value) ? null : {
      confirmPassword: {
        valid: false
      }
    };
  }

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

  public static isTokenPasswordValid(tokenPassword: string): Promise<boolean> {
    return new Promise(resolve => {
      (tokenPassword.length === 12) ? resolve(true) : resolve(false);
    });
  }

  public static isEmailValid(email: string): Promise<boolean> {
    return new Promise(resolve => {
      const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      (emailRegex.test(email)) ? resolve(true) : resolve(false);
    });
  }

  public static isThisAValidMongoObjectId(id: string): Promise<boolean> {
    return new Promise(resolve => {
      const hexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
      (hexRegExp.test(id)) ? resolve(true) : resolve(false);
    });
  }
}
