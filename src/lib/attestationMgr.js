import { decodeToken } from 'jsontokens'
import { Credentials, SimpleSigner } from 'uport'

class AttestationMgr {
    
    constructor(privateKey,appName,appMnid) {
        this.privateKey=privateKey;
        this.appMnid=appMnid;

        const signer = SimpleSigner(this.privateKey)
        this.credentials = new Credentials({
          appName: appName,
          address: this.appMnid,
          signer: signer
        })
    }

    //Create attestation for the sub
    attest(sub,phone){
        let expires=( Math.floor( Date.now() / 1000 ) + 30*24*60*60); //In 30 days (epoch in seconds)
        let att={
            sub: sub,
            exp: expires,
            claims: {phone: phone}
        }   
        return this.credentials.attest(att);
    }
}    

module.exports = AttestationMgr;