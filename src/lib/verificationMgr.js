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
                "INSERT INTO verifications(id,device_key,phone_number,code) \
                      VALUES ($1,$2,$3,$4)"
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

    async addDelivery(delivery){
        if(!delivery) throw('no delivery')    
        if(!delivery.verification_id) throw('no delivery.verification_id')
        if(!delivery.channel) throw('no delivery.channel')
        if(!delivery.provider_id) throw('no delivery.provider_id')
        if(!delivery.status) throw('no delivery.status')
        if(!this.pgUrl) throw('no pgUrl set')

        delivery.id=sha3(delivery.verification_id+
                ":"+delivery.channel+":"+delivery.provider_id).slice(2)
        

        const client = new Client({
            connectionString: this.pgUrl,
        })
        try{
            await client.connect()
            const res=await client.query(
                "INSERT INTO deliveries(id,verification_id,channel,provider_id,status) \
                      VALUES ($1,$2,$3,$4,$5)"
                , [ delivery.id, delivery.verification_id, 
                    delivery.channel , delivery.provider_id, delivery.status ]);
        } catch (e){
            throw(e);
        } finally {
            await client.end()
        }

        return delivery;
    }

    async updateDelivery(webhookParams){
        if(!webhookParams) throw('no webhookParams')    
        if(!webhookParams.MessageSid) throw('no webhookParams.MessageSid')
        if(!webhookParams.MessageStatus) throw('no webhookParams.MessageStatus')
        if(!this.pgUrl) throw('no pgUrl set')

        const client = new Client({
            connectionString: this.pgUrl,
        })
        try{
            await client.connect()
            const res=await client.query(
                "UPDATE deliveries \
                    SET status=$1 \
                  WHERE provider_id=$2"
                , [ webhookParams.MessageStatus, webhookParams.MessageSid ]);
        } catch (e){
            throw(e);
        } finally {
            await client.end()
        }

        return webhookParams;
    }

}    

module.exports = VerificationMgr;