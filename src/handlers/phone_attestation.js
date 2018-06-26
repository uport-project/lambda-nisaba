/*
file - phone_attestation.js

Function:
1. Verify fuel token
2. Verifies that sub has a uPort ID
3. Creates attestation once everything checks out 

inputs
- attestationMgr: Create attestation for the subscriber
- fuelTokenMgr: develops new JWT tokens for new users

resources
- N/A

resource description
- N/A
*/
import { Credentials, SimpleSigner } from "uport";

class PhoneAttestationHandler {
  constructor(attestationMgr, fuelTokenMgr) {
    this.attestationMgr = attestationMgr;
    this.fuelTokenMgr = fuelTokenMgr;
  }

  debug(l) {
    console.log("Phone handler:" + l);
  }

  async handle(event, context, cb) {
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
    if (body.token === undefined) {
      cb({ code: 400, message: "no fuelToken provided" });
      return;
    } else {
      try {
        let verified = await this.fuelTokenMgr.verifiy(body.token);
        if (!verified) {
          cb({ code: 400, message: "cannot verify token" });
          return;
        }
      } catch (e) {
        this.debug("Error validating fuelToken: " + e);
        cb({ code: 500, message: "not a valid jwt token" });
        return;
      }
    }

    let fuelToken = await this.fuelTokenMgr.decode(body.token).payload;
    let phoneNumber = fuelToken.phoneNumber;

    if (body.uportId === undefined) {
      cb({ code: 400, message: "no uPortId provided" });
      return;
    }
    let sub = body.uportId;

    this.debug("Creating attestation for sub:" + sub + " on " + phoneNumber);
    let attestation = await this.attestationMgr.attest(sub, phoneNumber);
    this.debug(attestation);
    cb(null, attestation);
  }
}

module.exports = PhoneAttestationHandler;
