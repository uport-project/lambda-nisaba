import rp  from 'request-promise';

class FuncaptchaMgr {
    
    constructor() {
        this.funcaptchaPrivateKey=null;
    }
    isSecretsSet(){
        return (this.funcaptchaPrivateKey !== null);
    }

    setSecrets(secrets){
        this.funcaptchaPrivateKey=secrets.FUNCAPTCHA_PRIVATE_KEY;
    }

    async verifyToken(funCaptchaToken){
        //Verify token:
        let verificationUrl = "https://funcaptcha.com/fc/v/?private_key="+this.funcaptchaPrivateKey+
                                "&session_token="+funCaptchaToken
        let options = {
            method: 'GET',
            uri: verificationUrl
        }
        let resp=await rp(options)
        return JSON.parse(resp)
    }

}    

module.exports = FuncaptchaMgr;