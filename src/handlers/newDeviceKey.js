import { publicToAddress } from 'ethjs-account';

class NewDeviceKeyHandler {

    constructor(authMgr,uPortMgr,fuelTokenMgr) {
        this.authMgr = authMgr;
        this.uPortMgr = uPortMgr;
        this.fuelTokenMgr = fuelTokenMgr;
    }

    async handle(event, context, cb) {
        let authToken;
        try{
            authToken = await this.authMgr.verifyNisaba(event)
        } catch(err) {
            console.log("Error on this.authMgr.verifyNisaba")
            console.log(err)
            cb({ code: 401, message: err })
            return;
        }


        let body;

        if (event && !event.body){
            body = event
        } else if (event && event.body) {
            try {
                body = JSON.parse(event.body)
            } catch (e) {
                cb({ code: 400, message: 'no json body'})
                return;
            }
        } else {
            cb({code: 400, message: 'no json body'})
            return;
        }

        //Check empty deviceKey
        if (!body.requestToken) {
            cb ({code: 400, message: 'requestToken parameter missing'})
            return;
          }

        //Verify Request Token
        let dRequestToken
        try{
            dRequestToken=await this.uPortMgr.verifyToken(body.requestToken)
        } catch(err) {
            console.log("Error on this.uPortMgr.verifyToken")
            console.log(err)
            const errMsg= (!err.message)? err: err.message;
            cb({ code: 500, message: errMsg })
            return;
        }
        //console.log(dRequestToken);

        //The address is the Keccak 256(publickey)
        //the last 20 bytes
        //https://github.com/ConsenSys/uport-mobile/blob/49e2dbed002aef36c08f3ae5ba09103ec187cf7d/ios/uPortMobile/Classes/UPTHDSigner.m#L205

        const pubKey=dRequestToken.profile.publicKey;
        console.log(pubKey)
        
        //https://github.com/ethjs/ethjs-account/blob/master/src/index.js#L88
        const address = publicToAddress(new Buffer(pubKey.slice(2), 'hex'));
        console.log(address)


        console.log(authToken.sub)

        //Check if address on fuelToken (authToken) is the same as the one on the requesToken
        if(address != authToken.sub){
            console.log("authToken.sub !== decodedRequestToken..address")
            cb({ code: 403, message: 'Auth token mismatch. Does not match `address` derived from requestToken' })
            return;
        }

        //Issue new fuelToken
        try{
            const newDeviceKey=dRequestToken.payload.newDeviceKey;
            let fuelToken = await this.fuelTokenMgr.newToken(newDeviceKey);
            cb(null,fuelToken);
        } catch(err) {
            console.log("Error on this.fuelTokenMgr.newToken")
            console.log(err)
            cb({ code: 500, message: err })
            return;
        }
    }
}    
    
module.exports = NewDeviceKeyHandler;