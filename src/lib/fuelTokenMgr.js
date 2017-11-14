class FuelTokenMgr {
    
    constructor() {
        this.signingKey=null;
    }
    isSecretsSet(){
        return (this.signingKey !== null);
    }

    setSecrets(secrets){
        this.signingKey=secrets.FUEL_TOKEN_PRIVATE_KEY;
    }

}    

module.exports = FuelTokenMgr;