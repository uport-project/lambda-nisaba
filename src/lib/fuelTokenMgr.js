import { decodeToken } from "jsontokens";
import { createJWT, verifyJWT, SimpleSigner } from "did-jwt";

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
    this.tokenSigner = SimpleSigner(this.signingKey);
  }

  async newToken(deviceKey) {
    const signer = this.tokenSigner;
    let now = Math.floor(Date.now() / 1000);
    return createJWT(
      {
        aud: [
          "api.uport.me/nisaba",
          "api.uport.me/unnu",
          "api.uport.me/sensui"
        ],
        exp: now + 300,
        sub: deviceKey,
        iat: now
      },
      { issuer: "api.uport.me/nisaba", signer }
    ).then(jwt => {
      return jwt;
    });
  }

  async verifyToken(fuelToken) {
    let aud = [
      "api.uport.me/nisaba",
      "api.uport.me/unnu",
      "api.uport.me/sensui"
    ];
    verifyJWT(fuelToken, {
      audience: aud
    }).then(({ payload, doc, did, signer, jwt }) => {
      console.log(payload);
    });
  }

  async decode(fuelToken) {
    return decodeToken(fuelToken);
  }
}

module.exports = FuelTokenMgr;
