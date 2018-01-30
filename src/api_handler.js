'use strict'
const AWS = require('aws-sdk');
const kms = new AWS.KMS();
const querystring = require('querystring');

const RecaptchaMgr = require('./lib/recaptchaMgr');
const FuncaptchaMgr = require('./lib/funcaptchaMgr');
const AuthMgr = require('./lib/authMgr');
const FuelTokenMgr = require('./lib/fuelTokenMgr');
const UPortMgr = require('./lib/uPortMgr');

const RecaptchaHandler = require('./handlers/recaptcha');
const FuncaptchaHandler = require('./handlers/funcaptcha');
const NewDeviceKeyHandler = require('./handlers/newDeviceKey');

let recaptchaMgr = new RecaptchaMgr();
let funcaptchaMgr = new FuncaptchaMgr();
let authMgr = new AuthMgr();
let fuelTokenMgr = new FuelTokenMgr();
let uPortMgr = new UPortMgr();


let recaptchaHandler = new RecaptchaHandler(recaptchaMgr,fuelTokenMgr);
let funcaptchaHandler = new FuncaptchaHandler(funcaptchaMgr,fuelTokenMgr);
let newDeviceKeyHandler = new NewDeviceKeyHandler(authMgr,uPortMgr,fuelTokenMgr);


module.exports.recaptcha = (event, context, callback) => { postHandler(recaptchaHandler,event,context,callback) }
module.exports.funcaptcha = (event, context, callback) => { postHandler(funcaptchaHandler,event,context,callback) }
module.exports.newDeviceKey = (event, context, callback) => { postHandler(newDeviceKeyHandler,event,context,callback) }

const postHandler = (handler,event,context,callback) =>{
  if(!recaptchaMgr.isSecretsSet() ||
     !funcaptchaMgr.isSecretsSet() ||
     !authMgr.isSecretsSet() ||
     !fuelTokenMgr.isSecretsSet() ){
    kms.decrypt({
      CiphertextBlob: Buffer(process.env.SECRETS, 'base64')
    }).promise().then(data => {
      const decrypted = String(data.Plaintext)
      recaptchaMgr.setSecrets(JSON.parse(decrypted))
      funcaptchaMgr.setSecrets(JSON.parse(decrypted))
      authMgr.setSecrets(JSON.parse(decrypted))
      fuelTokenMgr.setSecrets(JSON.parse(decrypted))
      doHandler(handler,event,context,callback)
    })
  }else{
    doHandler(handler,event,context,callback)
  }
}

const doHandler = (handler,event,context,callback) =>{
  handler.handle(event,context,(err,resp)=>{
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
