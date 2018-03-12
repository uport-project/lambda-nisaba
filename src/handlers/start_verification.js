class StartVerificationHandler {

    constructor(phoneVerificationMgr) {
        this.phoneVerificationMgr = phoneVerificationMgr;
    }

    debug(l) {
        console.log("Start verification handler:" + l);
    }

    async handle(body, cb) {
        //Check empty body
        if (!body) {
            cb({
                code: 400,
                message: 'no body'
            })
            return;
        }
        if (!body.deviceKey) {
            cb({
                code: 400,
                message: 'no deviceKey provided'
            })
            return;
        }
        if (!body.phoneNumber) {
            cb({
                code: 400,
                message: 'no phoneNumber provided'
            })
            return;
        }

        let deviceKey = body.deviceKey
        let phoneNumber = body.phoneNumber

        try {
            //Verify phone number using nexmo api
            let err = await this.phoneVerificationMgr.start(deviceKey, phoneNumber);

            if (!err){
                cb(null);
            } else {
                throw ({
                    code: 500,
                    message: err.message
                })
            }
        } catch (err) {
            cb(err)
        }
    }
}

module.exports = StartVerificationHandler;