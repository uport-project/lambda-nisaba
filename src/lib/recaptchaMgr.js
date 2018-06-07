/*
file - recaptchaMgr.js - setting and verify the captcha token being submited

resource - https://developers.google.com/recaptcha/intro

resource description -  A user authentication API that leverages captchas to
protect your service against spam and other types of automated abuse
*/
import rp from "request-promise";

class RecaptchaMgr {
  constructor() {
    this.recaptchaSecretKey = null;
  }
  isSecretsSet() {
    return this.recaptchaSecretKey !== null;
  }

  setSecrets(secrets) {
    //setting the secret environmental variable to RECAPTCHA_SECRET_KEY
    this.recaptchaSecretKey = secrets.RECAPTCHA_SECRET_KEY;
  }

  async verifyToken(reCaptchaToken) {
    //Verify token:
    let verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
    let options = {
      method: "POST",
      uri: verificationUrl,
      form: {
        secret: this.recaptchaSecretKey,
        response: reCaptchaToken
      }
    };
    let resp = await rp(options);
    return JSON.parse(resp);
  }
}

module.exports = RecaptchaMgr;
