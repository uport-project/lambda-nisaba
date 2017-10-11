import { decodeToken, TokenVerifier } from 'jwt-js'
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
        if (body.token === undefined){
          cb({code:400, message:'no fuelToken provided'})
          return;
        } else {
          try{
            let verified = new TokenVerifier(
              'ES256k', process.env.SIGNER_KEY).verify(body.token)
            if (!verified){
              cb({code:400, message:'cannot verify token'})
              return;
            }
          } catch(e){
            this.debug("Error validating fuelToken: " + e)
            cb({code:500, message:'not a valid jwt token'})
            return;
          }
        }

        let fuelToken = decodeToken(body.token).payload
        let phoneNumber=fuelToken.phoneNumber

        if (body.uportId === undefined){
          cb({code:400, message:'no uPortId provided'})
          return;
        }
        let sub=body.uportId

        this.debug("Creating attestation for sub:" +sub+" on "+phoneNumber)
        let attestation = await this.attestationMgr.attest(sub, phoneNumber);
        this.debug(attestation);
        cb(null,attestation);
    }
}

module.exports = PhoneHandler;
