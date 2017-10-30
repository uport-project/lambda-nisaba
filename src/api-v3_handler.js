'use strict'
const AWS = require('aws-sdk');
const kms = new AWS.KMS();
const querystring = require('querystring');


const VerificationMgr = require('./lib/verificationMgr');
const SmsMgr = require('./lib/smsMgr');
const CallMgr = require('./lib/callMgr');
const SmsHandler = require('./api-v3/sms');
const CallHandler = require('./api-v3/call');
const WebhookHandler = require('./api-v3/webhook');

let verificationMgr = new VerificationMgr();
let smsMgr = new SmsMgr();
let callMgr = new CallMgr();

let smsHandler = new SmsHandler(verificationMgr,smsMgr);
module.exports.sms = (event, context, callback) => { postHandler(smsHandler,event,context,callback) }
let callHandler = new CallHandler(callMgr);
module.exports.call = (event, context, callback) => { postHandler(callHandler,event,context,callback) }
module.exports.check = (event, context, callback) => { postHandler(callHandler,event,context,callback) }
module.exports.attestation = (event, context, callback) => { postHandler(callHandler,event,context,callback) }
let webhookHandler = new WebhookHandler(verificationMgr);
module.exports.webhook = (event, context, callback) => { postHandler(webhookHandler,event,context,callback) }


const postHandler = (handler,event,context,callback) =>{
  if(!verificationMgr.isSecretsSet() ||
     !smsMgr.isSecretsSet() ){
    kms.decrypt({
      CiphertextBlob: Buffer(process.env.SECRETS, 'base64')
    }).promise().then(data => {
      const decrypted = String(data.Plaintext)
      verificationMgr.setSecrets(JSON.parse(decrypted))
      smsMgr.setSecrets(JSON.parse(decrypted))
      doHandler(handler,event,context,callback)
    })
  }else{
    doHandler(handler,event,context,callback)
  }
}

const doHandler = (handler,event,context,callback) =>{
  //console.log(event.headers["content-type"])
  //console.log(event.body)
  let body;
  try{ 
    if(event.headers["content-type"].match(/application\/json/)){
      body = JSON.parse(event.body) 
    }else{
      body=querystring.parse(event.body)
    }
  } catch(e){
    console.log(e);body={}
  }
  handler.handle(body,(err,resp)=>{
    let response;
    if(err==null){
      response = {
          statusCode: 200,
          body: JSON.stringify({
            status: 'success',
            data: resp
          })
        }
    }else{
      //console.log(err);
      let code=500;
      if(err.code) code=err.code;
      let message=err;
      if(err.message) message=err.message;
      
      response = {
        statusCode: code,
        body: JSON.stringify({
          status: 'error',
          message: message
        })
      }
    }

    callback(null, response)
  })

} 
