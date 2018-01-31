import { publicToAddress } from 'ethjs-account';
import { pubToAddress } from 'ethereumjs-util';
import { keccak_256 } from 'js-sha3';
import sha3 from 'js-sha3';

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

        console.log("ISS MNID ADDR   : "+require('mnid').decode(dRequestToken.payload.iss).address)

        //The address is the Keccak 256(publickey)
        //the last 20 bytes
        //https://github.com/ConsenSys/uport-mobile/blob/49e2dbed002aef36c08f3ae5ba09103ec187cf7d/ios/uPortMobile/Classes/UPTHDSigner.m#L205

        const pubKey=dRequestToken.profile.publicKey;
        console.log(pubKey)
        //console.log(pubKey.length)
        const pubKey2=pubKey.slice(4);
        //console.log(pubKey2)
        //console.log(pubKey2.length)

        const keccakHash=keccak_256(pubKey2);
        //const keccakHash=sha3(pubKey2);
        //console.log(keccakHash)
        //console.log(keccakHash.length)

        const address0 = '0x'+keccakHash.slice(-40)
        console.log("HANDMADE        : "+address0)
        //console.log(address0.length)

        
        //https://github.com/ethjs/ethjs-account/blob/master/src/index.js#L88
        const address1 = publicToAddress(new Buffer(pubKey.slice(4), 'hex'));
        console.log("ETHJS-ACCOUNT   : "+address1)


        const address2 = pubToAddress(new Buffer(pubKey.slice(4), 'hex'));
        console.log("ETHEREUMJS_UTILS: "+'0x'+address2.toString('hex'))

        const address3 = sha3.keccak_256(new Buffer(pubKey.slice(4), 'hex')).slice(-40)
        console.log("PELITO STYLE    : "+'0x'+address3)


        console.log("FUEL TOKEN ADDR : "+authToken.sub)
        
        //Check if address on fuelToken (authToken) is the same as the one on the requesToken
        if(address0 != authToken.sub){
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