/*
file - check_verification.js

Function:
1. Verify device key
2. Provide request token

inputs
- phoneVerificationMgr: Verify phone number code sent via text

resources
- N/A

resource description
- N/A
*/
class CheckVerificationHandler {
  constructor(phoneVerificationMgr, fuelTokenMgr) {
    this.phoneVerificationMgr = phoneVerificationMgr;
    this.fuelTokenMgr = fuelTokenMgr;
  }

  debug(l) {
    console.log("Check verification handler:" + l);
  }

  async handle(event, context, cb) {
    let body;

    if (event && !event.body) {
      body = event;
    } else if (event && event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        cb({ code: 400, message: "no json body" });
        return;
      }
    } else {
      cb({ code: 400, message: "no json body" });
      return;
    }
    if (!body.deviceKey) {
      cb({
        code: 400,
        message: "no deviceKey provided"
      });
      return;
    }
    if (!body.code) {
      cb({
        code: 400,
        message: "no code provided"
      });
      return;
    }

    let deviceKey = body.deviceKey;
    let code = body.code;

    try {
      //Verify & request token
      this.phoneVerificationMgr.check(deviceKey, code).then(async (resp, err) => {
        if (err) {
          throw {
            code: 500,
            message: err.message
          };
        }

        //Get fuel token
        let fuelToken = await this.fuelTokenMgr.newToken(deviceKey);
        cb(null, fuelToken);
      });
    } catch (err) {
      cb({
        code: 500,
        message: err
      });
    }
  }
}

module.exports = CheckVerificationHandler;
