/*
file - continue_verification.js

Function:
1. continues verification started in start_verification

inputs
- phoneVerificationMgr: Verify phone number code sent via text

resources
- N/A

resource description
- N/A
*/
class ContinueVerificationHandler {
  constructor(phoneVerificationMgr) {
    this.phoneVerificationMgr = phoneVerificationMgr;
  }

  debug(l) {
    console.log("Continue verification handler:" + l);
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
    //Parse query parameter
    let deviceKey;

    if (event.pathParameters && event.pathParameters.deviceKey) {
      deviceKey = event.pathParameters.deviceKey;
    } else {
      cb({
        code: 400,
        message: "no device_key or device_key null"
      });
      return;
    }

    try {
      let err = await this.phoneVerificationMgr.next(deviceKey);

      if (!err) {
        cb(null);
      } else {
        throw {
          code: 500,
          message: err.message
        };
      }
    } catch (error) {
      cb({
        code: 500,
        message: error.message
      });
      return;
    }
  }
}

module.exports = ContinueVerificationHandler;
