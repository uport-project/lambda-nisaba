/*
file - authMgr.js - verifies authorization request to nisaba service

resources
- https://www.npmjs.com/package/jsontokens

resource description
- jsontokens - node.js library for signing, decoding, and
verifying JSON Web Tokens (JWTs)
*/
import { decodeToken, TokenVerifier } from "jsontokens";
// import { verifyJWT } from "did-jwt"

class AuthMgr {
  constructor() {
    this.nisabaPub = null;
  }

  isSecretsSet() {
    return this.nisabaPub !== null;
  }

  setSecrets(secrets) {
    this.nisabaPub = secrets.FUEL_TOKEN_PUBLIC_KEY;
  }

  async verifyNisaba(event) {
    if (!event.headers) throw "no headers";
    if (!event.headers["Authorization"]) throw "no Authorization Header";
    if (!this.nisabaPub) throw "nisabaPub not set";

    let authHead = event.headers["Authorization"];

    let parts = authHead.split(" ");
    if (parts.length !== 2) {
      throw "Format is Authorization: Bearer [token]";
    }
    let scheme = parts[0];
    if (scheme !== "Bearer") {
      throw "Format is Authorization: Bearer [token]";
    }

    let dtoken;
    try {
      dtoken = decodeToken(parts[1]);
    } catch (err) {
      console.log(err);
      throw "Invalid JWT token";
    }

    //Verify Signature
    try {
      let verified = new TokenVerifier("ES256k", this.nisabaPub).verify(
        parts[1]
      );
      if (!verified) throw "not verified";
    } catch (err) {
      console.log(err);
      throw "Invalid signature in JWT token";
    }

    // TODO verify: iat, exp, aud
    return dtoken.payload;
  }
}
module.exports = AuthMgr;
