class CheckVerificationHandler {

    constructor(phoneVerificationMgr) {
        this.phoneVerificationMgr = phoneVerificationMgr;
    }

    debug(l) {
        console.log("Check verification handler:" + l);
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
        if (!body.code) {
            cb({
                code: 400,
                message: 'no code provided'
            })
            return;
        }

        let deviceKey = body.deviceKey
        let code = body.code

        try {
            //Verify & request token
            this.phoneVerificationMgr.check(deviceKey, code)
                .then((resp, err) => {
                    if (err) {
                        throw ({
                            code: 500,
                            message: err.message
                        })
                    }
                    cb(null, { data: res.data })
                })
        } catch (err) {
            cb({
                code: 500,
                message: err
            })
        }
    }
}

module.exports = CheckVerificationHandler;