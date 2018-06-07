/*
file - uPortMgr.js - uport specific token verification (may want to take out)

resources
- https://github.com/uport-project/did-jwt/blob/develop/src/JWT.js

resource description
- uport specific JWT token verification
*/
import { verifyJWT } from "did-jwt/lib/JWT";

class UportMgr {
  async verifyToken(token) {
    if (!token) throw "no token";
    return verifyJWT(token);
  }
}
module.exports = UportMgr;
