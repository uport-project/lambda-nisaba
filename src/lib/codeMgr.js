import { Client } from 'pg'

class CodeMgr {
    
    constructor() {
        this.pgUrl=null;
    }

    isSecretsSet(){
        return (this.pgUrl !== null);
    }

    setSecrets(secrets){
        this.pgUrl=secrets.PG_URL;
    }

    async getCode(deviceKey,phoneNumber){
        if(!deviceKey) throw('no deviceKey')    
        if(!phoneNumber) throw('no phoneNumber')
        if(!this.pgUrl) throw('no pgUrl set')
        
        const client = new Client({
            connectionString: this.pgUrl,
        })
        await client.connect()
        try{
            const res=await client.query("SELECT * FROM verifications WHERE active='true'::boolean AND device_key=$1 AND phone_number=$2", [ deviceKey, phoneNumber ]);
            //console.log(res.rows)
            return (res.rows[0]);
        } catch (e){
            throw(e);
        } finally {
            await client.end()
        }
            

    }
}    

module.exports = CodeMgr;