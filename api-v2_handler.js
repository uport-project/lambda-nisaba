'use strict'

const PhoneHandler = require('./api-v2/phone');
const AttestationMgr = require('./lib/attestationMgr');

let attestationMgr = new AttestationMgr(secrets.SIGNER_KEY,secrets.APP_NAME,secrets.APP_NAME);

let phoneHandler = new PhoneHandler(attestationMgr);

module.exports.phone = (event, context, callback) => {
  //console.log(event)
  //console.log(event.body)
  let body;
  try{ body = JSON.parse(JSON.stringify(event)) } catch(e){console.log(e);body={}}
  phoneHandler.handle(body,(err,resp)=>{
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
