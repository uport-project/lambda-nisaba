class CheckVerificationHandler {
  constructor(phoneVerificationMgr) {
    this.phoneVerificationMgr = phoneVerificationMgr;
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
      this.phoneVerificationMgr.check(deviceKey, code).then((resp, err) => {
        if (err) {
          throw {
            code: 500,
            message: err.message
          };
        }
        cb(null, { data: resp.data });
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
