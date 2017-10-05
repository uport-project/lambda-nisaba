
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