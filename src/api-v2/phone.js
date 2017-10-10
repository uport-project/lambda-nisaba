import { decodeToken, TokenVerifier } from 'jsontokens'
import { Credentials, SimpleSigner } from 'uport'

class PhoneHandler{

    constructor(attestationMgr) {
        this.attestationMgr = attestationMgr;
    }

    debug(l){
        console.log("Phone handler:"+l);
    }

    async handle(body, cb) {
        //Check empty body
        if(!body){
            cb({code:403, message:'no body'})
            return;
        }

        //TODO: Check if the fuelToken is present and valid
        if (body.token === undefined){
          cb({code:400, message:'no fuelToken provided'})
          return;
        } else {
          console.log(body.token)
          try{
            let tv = new TokenVerifier('ES256K', process.env.SIGNER_KEY)
            console.log(body.token)
            tv.verify(body.token)
          } catch(e){
            console.log(e)
            cb({code:500, message:'bad token'})
            return;
          }
        }

        //TODO: Extract phoneNumber from fuelToken;
        let phoneNumber='' //fuelToken.phoneNumber;

        //TODO: Check if uportId is present
        let sub=''//body.uportId;

        this.debug("Creating attestation for sub:" +sub+" on "+phoneNumber)
        let attestation = await this.attestationMgr.attest(sub, phoneNumber);
        this.debug(attestation);
        cb(null,attestation);
    }
}

module.exports = PhoneHandler;