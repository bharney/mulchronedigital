export class ResponseMessages {

  public userNameIsNotValid(): string {
    return "You must enter a username between 4 and 12 characters long";
  }

  public passwordIsNotValid(): string {
    return "Your password must be atleast 8 characters with one upper case letter, one lower case letter, one number, and one special character";
  }

  public emailIsNotValid(): string {
    return "You must enter a valid email address";
  }

  public usernameIsTaken(username: string): string {
    return `Sorry but, the username ${username} is already in use by one of our users`;
  }

  public emailIsTaken(email: string): string {
    return `Sorry but, the email ${email} is already in use by by one of our users`;
  }

  public userRegistrationSuccessful(username: string): string {
    return `Thanks for registering ${username}!`;
  }

  public dbError(): string {
    return `Something went wrong on our end, please give a moment and try again`;
  }
}
