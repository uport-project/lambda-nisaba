
class FuncaptchaHandler {

    constructor(funCaptchaMgr,fuelTokenMgr) {
        this.funCaptchaMgr = funCaptchaMgr;
        this.fuelTokenMgr = fuelTokenMgr;
    }

    async handle(event, context, cb) {
        let body;

        if (event && !event.body){
            body = event
        } else if (event && event.body) {
            try {
                body = JSON.parse(event.body)
            } catch (e) {
                cb({ code: 400, message: 'no json body'})
                return;
            }
        } else {
            cb({code: 400, message: 'no json body'})
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
                let message;
                if(verificationResp.solved===false){
                    message="error verifying token: solved:false";
                }else{
                    message="error verifying token: "+verificationResp.error
                }
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