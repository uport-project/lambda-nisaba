class InstanceVerificationHandler {
    constructor(instanceMgr, fuelTokenMgr) {
      this.instanceMgr = instanceMgr;
      this.fuelTokenMgr = fuelTokenMgr;
    }
  
    async handle(event, context, cb) {
      let body;
  
      if (event && !event.body) {
        body = event;
      } else if (event && event.body) {
        try {
          body = JSON.parse(event.body);
        } catch (e) {
          cb({
            code: 400,
            message: "no json body"
          });
          return;
        }
      } else {
        cb({
          code: 400,
          message: "no json body"
        });
        return;
      }
  
      //Check empty instance ID token
      if (!body.iid_token) {
        cb({
          code: 400,
          message: "missing instance ID token"
        });
        return;
      }

      //Check empty deviceAddress
      if (!body.deviceAddress) {
        cb({
          code: 400,
          message: "missing deviceAddress"
        });
        return;
      }
  
      try {
        //Verify instanceId token exists and get details
        let iid_resp = await this.instanceMgr.getInstanceTokenDetails(
            body.iid_token
        );

        let check = await this.instanceMgr.checkInstanceDetails(iid_resp)
  
        //Get fuel token
        let fuelToken = await this.fuelTokenMgr.newToken(body.deviceAddress);
  
        cb(null, fuelToken);
      } catch (err) {
        cb(err);
      }
    }
  }
  
  module.exports = InstanceVerificationHandler;
  