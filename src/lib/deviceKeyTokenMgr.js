import { TokenSigner } from 'jwt-js'

class DeviceKeyTokenMgr {
    
    constructor() {
        this.verificationKey=null;
    }
    isSecretsSet(){
        return (this.verificationKey !== null);
    }

    setSecrets(secrets){
        this.verificationKey=secrets.FUEL_TOKEN_PUBLIC_KEY;
    }

    async verifyRequestToken(requestToken){
        throw("verifyRequestToken not implemented yet")
        return null;
    }

}    

module.exports = DeviceKeyTokenMgr;