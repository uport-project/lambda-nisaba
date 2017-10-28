
class SmsHandler {

    constructor(smsMgr) {
        this.smsMgr = smsMgr;
    }

    async handle(body, cb) {
        //Check empty body
        if(!body){
            cb({code:403, message:'no body'})
            return;
        }
        cb('not implemented');
    }
}    
    
module.exports = SmsHandler;