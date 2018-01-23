'use strict'
const AWS = require('aws-sdk');
const kms = new AWS.KMS();
const querystring = require('querystring');

const RecaptchaMgr = require('./lib/recaptchaMgr');
const FuncaptchaMgr = require('./lib/funcaptchaMgr');
const FuelTokenMgr = require('./lib/fuelTokenMgr');

const RecaptchaHandler = require('./handlers/recaptcha');
const FuncaptchaHandler = require('./handlers/funcaptcha');

let recaptchaMgr = new RecaptchaMgr();
let funcaptchaMgr = new FuncaptchaMgr();
let fuelTokenMgr = new FuelTokenMgr();

let recaptchaHandler = new RecaptchaHandler(recaptchaMgr,fuelTokenMgr);
module.exports.recaptcha = (event, context, callback) => { postHandler(recaptchaHandler,event,context,callback) }
let funcaptchaHandler = new FuncaptchaHandler(funcaptchaMgr,fuelTokenMgr);
module.exports.funcaptcha = (event, context, callback) => { postHandler(funcaptchaHandler,event,context,callback) }

const postHandler = (handler,event,context,callback) =>{
  if(!recaptchaMgr.isSecretsSet() ||
     !funcaptchaMgr.isSecretsSet() ||
     !fuelTokenMgr.isSecretsSet() ){
    kms.decrypt({
      CiphertextBlob: Buffer(process.env.SECRETS, 'base64')
    }).promise().then(data => {
      const decrypted = String(data.Plaintext)
      recaptchaMgr.setSecrets(JSON.parse(decrypted))
      funcaptchaMgr.setSecrets(JSON.parse(decrypted))
      fuelTokenMgr.setSecrets(JSON.parse(decrypted))
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
