
class RecaptchaHandler {

    constructor(recaptchaMgr,fuelTokenMgr) {
        this.recaptchaMgr = recaptchaMgr;
        this.fuelTokenMgr = fuelTokenMgr;
    }

    async handle(body, cb) {
        //Check null body
        if(!body){
            cb({code:403, message:'no body'})
            return;
        }
        //Check empty deviceKey
        if(!body.deviceKey){
            cb({code:403, message:'no deviceKey'})
            return;
        }
        //Check empty reCaptchaToken
        if(!body.reCaptchaToken){
            cb({code:403, message:'no reCaptchaToken'})
            return;
        }

        try{
            //Verify reCaptchaToken
            let isValid=await this.recaptchaMgr.isValidToken(body.reCaptchaToken);

            if (!isValid){
                throw("invalid token")
            }
            
            //Get fuel token
            let fuelToken = await this.fuelTokenMgr.newToken(body.deviceKey);

            cb(null,fuelToken);
                
        }catch (err){
            if(err.message) cb(err.message)
            if(!err.message) cb(err)
        }
    }
}    
    
module.exports = RecaptchaHandler;