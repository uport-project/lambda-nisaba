class ContinueVerificationHandler {

    constructor(phoneVerificationMgr) {
        this.phoneVerificationMgr = phoneVerificationMgr;
    }

    debug(l) {
        console.log("Continue verification handler:" + l);
    }

    async handle(body, cb) {

        //Parse query parameter
        let deviceKey = event.pathParameters.devicekey;

        // Check if deviceKey is not null
        if (!deviceKey || deviceKey == null) {
            cb({
                code: 400,
                message: 'no device_key or device_key null'
            })
            return;
        }

        try {
            let err = await this.phoneVerificationMgr.next(deviceKey)

            if (!err) {
                cb(null);
            } else {
                throw ({
                    code: 500,
                    message: err.message
                })
            }
        } catch (error) {
            cb({
                code: 500,
                message: error.message
            })
            return;
        }



    }
}

module.exports = ContinueVerificationHandler;