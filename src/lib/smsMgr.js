class SmsMgr {
    
    constructor() {
        this.twilioAccountSid=null;
        this.twilioAuthToken=null;
    }
    isSecretsSet(){
        return (this.twilioAccountSid !== null && this.twilioAuthToken !== null);
    }

    setSecrets(secrets){
        this.twilioAccountSid=secrets.TWILIO_ACCOUNT_SID;
        this.twilioAuthToken=secrets.TWILIO_AUTH_TOKEN;;
    }

    async sendCode(code,phoneNumber){
        if(!code) throw('no code')    
        if(!phoneNumber) throw('no phoneNumber')
        if(!this.twilioAccountSid) throw('no twilioAccountSid set')
        if(!this.twilioAuthToken) throw('no twilioAuthToken set')

        const client = require('twilio')(this.twilioAccountSid, this.twilioAuthToken);
        
        let body="Your uPort code is: "+code
        
        let message;
        try{
            message = await client.messages.create({
                to: '+'+phoneNumber,
                from: '+12243024792',
                body: body,
                statusCallback: 'https://api.uport.space/nisaba/v3/webhook'
            })
        } catch(err){
            err.channel="twilio.sms"
            throw(err)
        } 

        let extra={
            accountSid: message.accountSid,
            from: message.from,
            price: message.price,
            priceUnit: message.priceUnit,
            to: message.to,
            uri: message.uri
        }
        let delivery={
            channel: 'twilio.sms', 
            provider_id: message.sid,
            status: message.status,
            extra: extra
        }
        return delivery;
        
    }
}    

module.exports = SmsMgr;