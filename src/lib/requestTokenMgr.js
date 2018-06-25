import { verifyJWT } from "did-jwt/lib/JWT";

class RequestTokenMgr {
  constructor() {
    this.address = null;
    this.aud = null;
  }

  isSecretsSet() {
    return this.address != null;
  }

  setSecrets(secrets) {
    this.address = secrets.FUEL_TOKEN_ADDRESS;
    this.aud = secrets.AUDIENCE_ADDRESS || this.address;
  }

  async verifyToken(token) {
    if (!token) throw "no token";
    return verifyJWT(token, {
      audience: this.aud
    });
  }
}
module.exports = RequestTokenMgr;
