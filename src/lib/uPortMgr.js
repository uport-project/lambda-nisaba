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
    /*
      Background Information
      - jwt	String containing a JSON Web Tokens (JWT)	yes
      - options.auth	Require signer to be listed in the authentication section
      of the DID document (for Authentication of a user with DID-AUTH)
      - options.audience	The DID of the audience of the JWT	no
      - options.callbackUrl	The the URL receiving the JWT	no

      The Input Flow
      verifyJWT() --> resolveAuthenticator() --> normalizeDID() -->
      sees if it has '/^did:/' in it or if it isMNID() --> puts error if no and
      continues function if yest

      Additional Information
      where mnid stands for Multi Network Identifier (MNID), https://github.com/uport-project/mnid
      ex DID: const did = `did:uport:${mnid}`
      mnid is a base58 encoded result with various attributes like the following:
        - network
        - address

      Expectations of the JWT
      It needs to have the following:
      const did = obj.did // DID of signer
        *      did         DID of signer
        *      doc         DID Document of signer
        *      signerKeyId ID of key in DID document that signed JWT
        *      jwt         a JSON Web Token to verify
        *      auth        Require signer to be listed in the authentication section of the DID document (for Authentication purposes)
        *      audience    DID of the recipient of the JWT
        *      callbackUrl callback url in JWT

    */
  }
}
module.exports = UportMgr;
