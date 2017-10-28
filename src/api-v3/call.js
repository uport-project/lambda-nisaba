
class CallHandler {

    constructor(callMgr) {
        this.callMgr = callMgr;
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
    
module.exports = CallHandler;