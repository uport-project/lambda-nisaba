import { verifyJWT } from "did-jwt/lib/JWT";

class RequestTokenMgr {
  constructor() {
    this.aud = null;
  }

  isSecretsSet() {
    return this.aud != null;
  }

  setSecrets(secrets) {
    this.aud = secrets.AUDIENCE_ADDRESS || secrets.FUEL_TOKEN_ADDRESS;
  }

  async verifyToken(token) {
    if (!token) throw "no token";
    return verifyJWT(token, {
      audience: this.aud
    });
  }
}
module.exports = RequestTokenMgr;
