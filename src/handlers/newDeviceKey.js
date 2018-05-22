import { toEthereumAddress } from "did-jwt/lib/Digest";

class NewDeviceKeyHandler {
  constructor(authMgr, uPortMgr, fuelTokenMgr) {
    this.authMgr = authMgr;
    this.uPortMgr = uPortMgr;
    this.fuelTokenMgr = fuelTokenMgr;
  }

  async handle(event, context, cb) {
    let authToken;
    try {
      authToken = await this.authMgr.verifyNisaba(event);
    } catch (err) {
      console.log("Error on this.authMgr.verifyNisaba");
      console.log(err);
      cb({
        code: 401,
        message: err
      });
      return;
    }

    let body;

    if (event && !event.body) {
      body = event;
    } else if (event && event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        cb({
          code: 400,
          message: "no json body"
        });
        return;
      }
    } else {
      cb({
        code: 400,
        message: "no json body"
      });
      return;
    }

    //Check empty deviceKey
    if (!body.requestToken) {
      cb({
        code: 400,
        message: "requestToken parameter missing"
      });
      return;
    }

    //Verify Request Token
    let dRequestToken;
    try {
      dRequestToken = await this.uPortMgr.verifyToken(body.requestToken);
    } catch (err) {
      console.log("Error on this.uPortMgr.verifyToken");
      console.log(err);
      const errMsg = !err.message ? err : err.message;
      cb({
        code: 500,
        message: errMsg
      });
      return;
    }
    console.log(dRequestToken);

    console.log("dRequestToken publicKey", dRequestToken.doc.publicKey);
    const pubKey = dRequestToken.doc.publicKey.find(
      pub => pub.type === "Secp256k1VerificationKey2018"
    );
    console.log("pubkey", pubKey);
    const address =
      pubKey.ethereumAddress || toEthereumAddress(pubKey.publicKeyHex);

    console.log("REQ TOKEN ADDR  : ", address);
    console.log("FUEL TOKEN ADDR : ", authToken.sub);

    //Check if address on fuelToken (authToken) is the same as the one on the requesToken
    if (address != authToken.sub) {
      console.log("authToken.sub !== decodedRequestToken..address");
      cb({
        code: 403,
        message:
          "Auth token mismatch. Does not match `address` derived from requestToken"
      });
      return;
    }

    //Issue new fuelToken
    try {
      const newDeviceKey = dRequestToken.payload.newDeviceKey;
      let fuelToken = await this.fuelTokenMgr.newToken(newDeviceKey);
      cb(null, fuelToken);
    } catch (err) {
      console.log("Error on this.fuelTokenMgr.newToken");
      console.log(err);
      cb({
        code: 500,
        message: err
      });
      return;
    }
  }
}

module.exports = NewDeviceKeyHandler;
