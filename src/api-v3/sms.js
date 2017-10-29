
class SmsHandler {

    constructor(codeMgr,smsMgr) {
        this.codeMgr = codeMgr;
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

        //Get code
        let code=await this.codeMgr.getCode(body.deviceKey,body.phoneNumber);
        
        //Send code
        let resp=await this.smsMgr.sendCode(code,body.phoneNumber);
        
        cb(null,resp);
    }
}    
    
module.exports = SmsHandler;