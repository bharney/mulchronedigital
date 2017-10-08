export class JsonWebToken implements IJsonWebToken {
  public id;
  public isAdmin;
  public iat;
  public exp;

  constructor(id: string, isAdmin: string, iat: number, exp: number) {
    this.id = id;
    this.isAdmin = isAdmin;
    this.iat = iat;
    this.exp = exp;
  }
}

export interface IJsonWebToken {
  id: string;
  isAdmin: false;
  iat: number;
  exp: number;
}
