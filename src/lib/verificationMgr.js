import { Client } from 'pg'
import sha3 from 'solidity-sha3'


class VerificationMgr {
    
    constructor() {
        this.pgUrl=null;
    }

    isSecretsSet(){
        return (this.pgUrl !== null);
    }

    setSecrets(secrets){
        this.pgUrl=secrets.PG_URL;
    }

    async get(deviceKey,phoneNumber){
        if(!deviceKey) throw('no deviceKey')    
        if(!phoneNumber) throw('no phoneNumber')
        if(!this.pgUrl) throw('no pgUrl set')
        
        const client = new Client({
            connectionString: this.pgUrl,
        })
        try{
            await client.connect()
            const res=await client.query(
                "SELECT * \
                   FROM verifications \
                  WHERE device_key=$1 \
                    AND phone_number=$2 \
               ORDER BY created DESC \
                  LIMIT 1"
                  , [ deviceKey, phoneNumber ]);
            //console.log(res.rows)
            if(res.rows.length == 1){
                if(!this.isExpired(res.rows[0])){
                    console.log("existing verification still valid")
                    return res.rows[0]
                }else{
                    console.log("verification expired")
                    return await this.create(deviceKey,phoneNumber);
                }
            }else{
                console.log("create verification")
                return await this.create(deviceKey,phoneNumber);
            }
        } catch (e){
            throw(e);
        } finally {
            await client.end()
        }
    }

    
    isExpired(row){
        let created=Date.parse(row.created)
        let now=new Date();
        let dif=now-created;
        let expireAt= 10 * 60 * 1000 //10 minutes
        return (dif >= expireAt);
    }

    async create(deviceKey,phoneNumber){
        if(!deviceKey) throw('no deviceKey')    
        if(!phoneNumber) throw('no phoneNumber')
        if(!this.pgUrl) throw('no pgUrl set')

        const code=Math.floor(100000 + Math.random() * 900000)
        const id=sha3(deviceKey+":"+phoneNumber+":"+code).slice(2)
        
        const client = new Client({
            connectionString: this.pgUrl,
        })
        try{
            await client.connect()
            const res=await client.query(
                "INSERT INTO verifications(id,device_key,phone_number,code,log) \
                      VALUES ($1,$2,$3,$4,jsonb '[]')"
                , [ id, deviceKey, phoneNumber , code ]);
        } catch (e){
            throw(e);
        } finally {
            await client.end()
        }

        return {
            id: id,
            device_key: deviceKey,
            phone_number: phoneNumber,
            code: code
        };
    }

    async log(id,log){
        if(!id) throw('no id')    
        if(!log) throw('no log')
        if(!this.pgUrl) throw('no pgUrl set')

        const now=Math.floor (Date.now() / 1000)
        log.timestamp=now;

        const logS=JSON.stringify([log])
        
        const client = new Client({
            connectionString: this.pgUrl,
        })
        try{
            await client.connect()
            console.log(logS)
            const res=await client.query(
                "UPDATE verifications \
                    SET log=log || $1::jsonb \
                  WHERE id=$2"
                , [ logS,id ]);
        } catch (e){
            throw(e);
        } finally {
            await client.end()
        }

        return log;
    }

}    

module.exports = VerificationMgr;