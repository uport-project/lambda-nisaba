
class SmsHandler {

    constructor(verificationMgr,smsMgr) {
        this.verificationMgr = verificationMgr;
        this.smsMgr = smsMgr;
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
        //Check empty phoneNumber
        if(!body.phoneNumber){
            cb({code:403, message:'no phoneNumber'})
            return;
        }

        try{
            //Get code
            let verification=await this.verificationMgr.get(body.deviceKey,body.phoneNumber);
            
            //Send code
            let resp=await this.smsMgr.sendCode(verification.code,body.phoneNumber);
            
            //Log sms sent on verification
            let log={
                channel: 'sms'
            }
            let r=await this.verificationMgr.log(verification.id,log)

            cb(null,resp);
        }catch (err){
            if(err.message) cb(err.message)
            if(!err.message) cb(err)
        }
    }
}    
    
module.exports = SmsHandler;