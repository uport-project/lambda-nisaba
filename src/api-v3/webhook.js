

class WebhookHandler {

    constructor(verificationMgr) {
        this.verificationMgr = verificationMgr;
    }

    async handle(body, cb) {
        //Check empty body
        if(!body){
            cb({code:403, message:'no body'})
            return;
        }
        let resp = await this.verificationMgr.updateDelivery(body)

        cb(null,resp);
    }
}    
    
module.exports = WebhookHandler;