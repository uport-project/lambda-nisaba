'use strict'

const SmsMgr = require('./lib/smsMgr');
const CallMgr = require('./lib/callMgr');
const SmsHandler = require('./api-v3/sms');
const CallHandler = require('./api-v3/call');

let smsMgr = new SmsMgr();
let callMgr = new CallMgr();

let smsHandler = new SmsHandler(smsMgr);
module.exports.sms = (event, context, callback) => { postHandler(smsHandler,event,context,callback) }
let callHandler = new CallHandler(callMgr);
module.exports.call = (event, context, callback) => { postHandler(callHandler,event,context,callback) }
module.exports.check = (event, context, callback) => { postHandler(callHandler,event,context,callback) }
module.exports.attestation = (event, context, callback) => { postHandler(callHandler,event,context,callback) }


const postHandler = (handler,event,context,callback) =>{
  //console.log(event)
  //console.log(event.body)
  let body;
  try{ body = JSON.parse(event.body) } catch(e){console.log(e);body={}}
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
