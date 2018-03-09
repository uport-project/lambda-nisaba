import rp from 'request-promise';

class RecaptchaMgr {

    constructor() {
        this.recaptchaSecretKey = null;
    }
    isSecretsSet() {
        return (this.recaptchaSecretKey !== null);
    }

    setSecrets(secrets) {
        this.recaptchaSecretKey = secrets.RECAPTCHA_SECRET_KEY;
    }

    async verifyToken(reCaptchaToken) {
        //Verify token:
        let verificationUrl = "https://www.google.com/recaptcha/api/siteverify"
        let options = {
            method: 'POST',
            uri: verificationUrl,
            form: {
                secret: this.recaptchaSecretKey,
                response: reCaptchaToken
            },
        }
        let resp = await rp(options)
        return JSON.parse(resp)
    }

}

module.exports = RecaptchaMgr;