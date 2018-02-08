export class JsonWebToken implements IJsonWebToken {
  public id;
  public isAdmin;
  public iat;
  public exp;
  public publicKeyPairOne;
  public privateKeyPairTwo;

  constructor(id: string, isAdmin: string, iat: number, exp: number, publicKeyPairOne: string, privateKeyPairTwo: string) {
    this.id = id;
    this.isAdmin = isAdmin;
    this.iat = iat;
    this.exp = exp;
    this.publicKeyPairOne = publicKeyPairOne;
    this.privateKeyPairTwo = privateKeyPairTwo;
  }
}

export interface IJsonWebToken {
  id: string;
  isAdmin: false;
  iat: number;
  exp: number;
}
