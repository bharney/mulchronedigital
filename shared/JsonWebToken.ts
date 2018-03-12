export class JsonWebToken {
  public id: string;
  public isAdmin: boolean;
  public iat: number;
  public exp: number;
  public publicKeyPairOne: string;
  public privateKeyPairTwo: string;

  constructor(id: string, isAdmin: boolean, iat: number, exp: number, publicKeyPairOne: string, privateKeyPairTwo: string) {
    this.id = id;
    this.isAdmin = isAdmin;
    this.iat = iat;
    this.exp = exp;
    this.publicKeyPairOne = publicKeyPairOne;
    this.privateKeyPairTwo = privateKeyPairTwo;
  }
}
