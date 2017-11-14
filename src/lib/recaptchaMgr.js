import rp  from 'request-promise';

class RecaptchaMgr {
    
    constructor() {
        this.recaptchaSecretKey=null;
    }
    isSecretsSet(){
        return (this.recaptchaSecretKey !== null);
    }

    setSecrets(secrets){
        this.recaptchaSecretKey=secrets.RECAPTCHA_SECRET_KEY;
    }

    async isValidToken(reCaptchaToken){
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
        let resp=await rp(options)
        //console.log(resp)
        return resp.success===true;
    }

}    

module.exports = RecaptchaMgr;