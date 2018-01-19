
class NewDeviceKeyHandler {

    constructor(deviceKeyTokenMgr,fuelTokenMgr) {
        this.deviceKeyTokenMgr = deviceKeyTokenMgr;
        this.fuelTokenMgr = fuelTokenMgr;
    }

    async handle(body, cb) {
        //Check null body
        if(!body){
            cb({code:400, message:'no body'})
            return;
        }
        //Check empty deviceKey
        if(!body.requestToken){
            cb({code:400, message:'no requestToken'})
            return;
        }

        //TODO: Verify Request Token
        try{
            const ret = await this.deviceKeyTokenMgr.verifyRequestToken(body.requestToken) 
            console.log(ret)

        } catch(err) {
            console.log("Error on this.deviceKeyTokenMgr.verifyRequestToken")
            console.log(err)
            cb({ code: 500, message: err })
            return;
        }


        //TODO: If Request Token is valid issue new fuelToken


        cb({code: 500, message: 'not implemented'})

    }
}    
    
module.exports = NewDeviceKeyHandler;