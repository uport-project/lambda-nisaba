
class RecaptchaHandler {

    constructor(recaptchaMgr,fuelTokenMgr) {
        this.recaptchaMgr = recaptchaMgr;
        this.fuelTokenMgr = fuelTokenMgr;
    }

    async handle(body, cb) {
        //Check null body
        if(!body){
            cb({code:400, message:'no body'})
            return;
        }
        //Check empty deviceKey
        if(!body.deviceKey){
            cb({code:400, message:'no deviceKey'})
            return;
        }
        //Check empty reCaptchaToken
        if(!body.reCaptchaToken){
            cb({code:400, message:'no reCaptchaToken'})
            return;
        }

        //TODO:Check remoteIp


        try{
            //Verify reCaptchaToken
            let verificationResp=await this.recaptchaMgr.verifyToken(body.reCaptchaToken);

            if (!verificationResp.success===true){
                console.error(verificationResp);
                let message="error verifying token: "+verificationResp["error-codes"]
                throw({code: 400, message: message})
            }
            
            //Get fuel token
            let fuelToken = await this.fuelTokenMgr.newToken(body.deviceKey);

            cb(null,fuelToken);
                
        }catch (err){
            cb(err)
        }
    }
}    
    
module.exports = RecaptchaHandler;