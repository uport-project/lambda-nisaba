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
        
        return false;
    }

}    

module.exports = RecaptchaMgr;