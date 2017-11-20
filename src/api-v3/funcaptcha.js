
class FuncaptchaHandler {

    constructor(funCaptchaMgr,fuelTokenMgr) {
        this.funCaptchaMgr = funCaptchaMgr;
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
        //Check empty funCaptchaToken
        if(!body.funCaptchaToken){
            cb({code:400, message:'no funCaptchaToken'})
            return;
        }

        try{
            //Verify funCaptchaToken
            let verificationResp=await this.funCaptchaMgr.verifyToken(body.funCaptchaToken);

            if (!verificationResp.solved===true){
                console.error(verificationResp);
                let message="error verifying token: "+verificationResp.error
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
    
module.exports = FuncaptchaHandler;