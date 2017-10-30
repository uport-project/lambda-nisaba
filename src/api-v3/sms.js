
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
            
            let delivery;
            try{
                //Send code
                delivery=await this.smsMgr.sendCode(verification.code,body.phoneNumber);

                //Log delivery
                delivery.verification_id=verification.id
                let r=await this.verificationMgr.addDelivery(delivery)

                cb(null,verification.id);
                
            }catch (e){
                delivery={
                    channel: e.channel,
                    status: "error",
                    extra: e
                }
                //Log delivery
                delivery.verification_id=verification.id
                let r=await this.verificationMgr.addDelivery(delivery)

                throw (e)         
            }
        }catch (err){
            if(err.message) cb(err.message)
            if(!err.message) cb(err)
        }
    }
}    
    
module.exports = SmsHandler;