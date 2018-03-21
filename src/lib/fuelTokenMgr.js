import { TokenSigner, TokenVerifier, decodeToken } from "jsontokens";

class FuelTokenMgr {
  constructor() {
    this.signingKey = null;
    this.publicKey = null;
    this.tokenSigner = null;
  }
  isSecretsSet() {
    return this.signingKey !== null && this.publicKey !== null;
  }

  setSecrets(secrets) {
    this.signingKey = secrets.FUEL_TOKEN_PRIVATE_KEY;
    this.publicKey = secrets.FUEL_TOKEN_PUBLIC_KEY;
    this.tokenSigner = new TokenSigner("ES256K", this.signingKey);
  }

  async newToken(deviceKey) {
    let now = Math.floor(Date.now() / 1000);
    let payload = {
      iss: "api.uport.me/nisaba",
      iat: now,
      exp: now + 300,
      sub: deviceKey,
      aud: ["api.uport.me/nisaba", "api.uport.me/unnu", "api.uport.me/sensui"]
    };
    let signedJwt = this.tokenSigner.sign(payload);
    return signedJwt;
  }

  async verifyToken(fuelToken) {
    return new TokenVerifier("ES256k", this.publicKey).verify(fuelToken);
  }

  async decode(fuelToken) {
    return decodeToken(fuelToken);
  }
}

module.exports = FuelTokenMgr;
