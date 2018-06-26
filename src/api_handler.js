"use strict";
const AWS = require("aws-sdk");
const querystring = require("querystring");
require('ethr-did-resolver')()
require('uport-did-resolver')()
const AuthMgr = require("./lib/authMgr");
const FuelTokenMgr = require("./lib/fuelTokenMgr");
const RequestTokenMgr = require("./lib/requestTokenMgr");
const AttestationMgr = require("./lib/attestationMgr");
const PhoneVerificationMgr = require("./lib/phoneVerificationMgr");

const NewDeviceKeyHandler = require("./handlers/newDeviceKey");
const PhoneAttestationHandler = require("./handlers/phone_attestation");
const StartVerificationHandler = require("./handlers/start_verification");
const ContinueVerificationHandler = require("./handlers/continue_verification");
const CheckVerificationHandler = require("./handlers/check_verification");

//instantiate manager services needed for methods
let authMgr = new AuthMgr(); //verifies authorization request to nisaba service
let fuelTokenMgr = new FuelTokenMgr(); //develops new JWT tokens for new users
let requestTokenMgr = new RequestTokenMgr(); // Generate and verify request token
let attestationMgr = new AttestationMgr(); // Create attestation for the subscriber
let phoneVerificationMgr = new PhoneVerificationMgr(); //Verify phone number code sent via text

let newDeviceKeyHandler = new NewDeviceKeyHandler(
  authMgr,
  requestTokenMgr,
  fuelTokenMgr
);
let phoneAttestationHandler = new PhoneAttestationHandler(
  attestationMgr,
  fuelTokenMgr
);
let startVerificationHandler = new StartVerificationHandler(
  phoneVerificationMgr
);
let continueVerificationHandler = new ContinueVerificationHandler(
  phoneVerificationMgr
);
let checkVerificationHandler = new CheckVerificationHandler(
  phoneVerificationMgr,
  fuelTokenMgr
);

//Get a new fuel token by sending a signed requestToken
module.exports.newDeviceKey = (event, context, callback) => {
  postHandler(newDeviceKeyHandler, event, context, callback);
};

//Get a an attestation for the verified phone on the fuelToken
module.exports.phone_attestation = (event, context, callback) => {
  postHandler(phoneAttestationHandler, event, context, callback);
};

//Verify a phone number using Nexmo verification
module.exports.start_verification = (event, context, callback) => {
  postHandler(startVerificationHandler, event, context, callback);
};

//continues verification started in start_verification
module.exports.continue_verification = (event, context, callback) => {
  postHandler(continueVerificationHandler, event, context, callback);
};

//Verify device key and provided code & provides request token
module.exports.check_verification = (event, context, callback) => {
  postHandler(checkVerificationHandler, event, context, callback);
};

const postHandler = (handler, event, context, callback) => {
  if (
    !authMgr.isSecretsSet() ||
    !fuelTokenMgr.isSecretsSet() ||
    !phoneVerificationMgr.isSecretsSet()
  ) {
    const kms = new AWS.KMS();
    kms
      .decrypt({
        CiphertextBlob: Buffer(process.env.SECRETS, "base64")
      })
      .promise()
      .then(data => {
        const decrypted = String(data.Plaintext);
        authMgr.setSecrets(JSON.parse(decrypted));
        fuelTokenMgr.setSecrets(JSON.parse(decrypted));
        phoneVerificationMgr.setSecrets(JSON.parse(decrypted));
        requestTokenMgr.setSecrets(JSON.parse(decrypted));
        doHandler(handler, event, context, callback);
      });
  } else {
    doHandler(handler, event, context, callback);
  }
};

const doHandler = (handler, event, context, callback) => {
  handler.handle(event, context, (err, resp) => {
    let response;
    if (err == null) {
      response = {
        statusCode: 200,
        body: JSON.stringify({
          status: "success",
          data: resp
        })
      };
    } else {
      console.log(err);
      let code = 500;
      if (err.code) code = err.code;
      let message = err;
      if (err.message) message = err.message;

      response = {
        statusCode: code,
        body: JSON.stringify({
          status: "error",
          message: message
        })
      };
    }

    callback(null, response);
  });
};
