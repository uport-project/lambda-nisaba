import { TokenSigner } from 'jwt-js'

class FuelTokenMgr {
    
    constructor() {
        this.signingKey=null;
        this.tokenSigner=null;
    }
    isSecretsSet(){
        return (this.signingKey !== null);
    }

    setSecrets(secrets){
        this.signingKey=secrets.FUEL_TOKEN_PRIVATE_KEY;
        this.tokenSigner=new TokenSigner('ES256K', this.signingKey)
    }

    async newToken(deviceKey){
        let now = Math.floor(Date.now() / 1000)
        let payload = {
          iss: 'nisaba.uport.me',
          iat: now,
          exp: now + 300,
          sub: deviceKey,
          aud: [
            'nisaba.uport.me',
            'unnu.uport.me',
            'sensui.uport.me'
          ]
        }
        let signedJwt = this.tokenSigner.sign(payload)
        return signedJwt;
    }

}    

module.exports = FuelTokenMgr;