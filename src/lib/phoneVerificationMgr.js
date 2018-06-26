/*
file - phoneVerificationMgr.js - instantiates Nexmo service to verify
phone number code sent via text

resources
- Nexmo - https://www.npmjs.com/package/nexmo
- Nexmo - https://developer.nexmo.com/documentation

resource description
- Nexmo - Text/Voice and Verification API suite
*/
import Nexmo from "nexmo";
import { decodeToken, TokenVerifier } from "jsontokens";
import { Client } from "pg";

class PhoneVerificationMgr {
  constructor() {
    this.api_key = null;
    this.api_secret = null;
    this.pgUrl = null;
    this.from = null;
    this.nexmo = null;
  }

  isSecretsSet() {
    return (
      this.api_key !== null ||
      this.api_secret !== null ||
      this.from !== null ||
      this.pgUrl !== null
    );
  }

  setSecrets(secrets) {
    this.api_key = secrets.NEXMO_API_KEY;
    this.api_secret = secrets.NEXMO_API_SECRET;
    this.from = secrets.NEXMO_FROM;
    this.pgUrl = secrets.PG_URL;
    this.nexmo = new Nexmo(
      {
        apiKey: this.api_key,
        apiSecret: this.api_secret
      },
      {
        debug: false,
        appendToUserAgent: "NexmoVerifyTest/nisaba"
      }
    );
  }

  async start(deviceKey, phoneNumber) {
    if (!deviceKey) throw "no deviceKey";
    if (!phoneNumber) throw "no destination phoneNumber";
    if (!this.nexmo) throw "client is not initialized";

    //uport specifc [US1]
    let params = {
      number: phoneNumber,
      brand: "NexmoVerifyTest",
      code_length: 6
    };

    /*
      resource:  https://developer.nexmo.com/api/verify#verify-request
      required params
        format - json The response format. Either json or xml
        brand - The name of the company or App you are using Verify for
        number - The mobile or landline phone number to verify
        code_length - The length of the PIN. Possible values are 6 or 4 characters.
        The default value is 4
    */
    this.nexmo.verify.request(params, (err, resp) => {
      if (err) {
        console.log("error on nexmo.verify.request", err);
        throw "error calling nexmo.verify.request";
      }

      console.log("nexmo.status: ", resp.status);
      if (resp.status == "0" || resp.status == "10") {
        //00 > Success - The request was successfully accepted by Nexmo.
        //10 > Concurrent verifications to the same number are not allowed.
        this.createRequest(deviceKey, resp.request_id, resp.status);
        return;
      } else {
        //Basically, an error
        console.log("Nexmo error: ", resp.status, ". Phone: ", phoneNumber);
        return {
          message: resp.status,
          phone: phoneNumber
        };
      }
    });
  }

  async next(deviceKey) {
    return this.control(deviceKey, "trigger_next_event");
  }

  async cancel(deviceKey) {
    return this.control(deviceKey, "cancel");
  }

  async control(deviceKey, command) {
    if (!deviceKey) throw "no deviceKey";
    if (!command) throw "no command";
    if (!this.nexmo) throw "client is not initialized";

    let requestId;
    requestId = await this.getNexmoRequest(deviceKey);
    if (!requestId) throw "request_id not found";

    let params = {
      request_id: requestId,
      cmd: command
    };

    this.nexmo.verify.control(params, (err, resp) => {
      if (err) {
        console.error("error calling nexmo.verify.control", command, err);
        throw "error on nexmo.verify.control";
      }

      console.log("resp", resp);

      if (resp.status !== "0") {
        console.log("nexmo.status:", resp.status, "error:", resp.error_text);
        return {
          status: resp.status,
          message: resp.error_text
        };
      } else {
        return;
      }
    });
  }

  async check(deviceKey, code) {
    if (!deviceKey) throw "no deviceKey";
    if (!code) throw "no code";
    if (!this.nexmo) throw "client is not initialized";

    let requestId;
    requestId = await this.getNexmoRequest(deviceKey);
    if (!requestId) throw "request_id not found";

    let params = {
      request_id: requestId,
      code: code
    };

    this.nexmo.verify.check(params, (err, resp) => {
      if (err) {
        console.error("error calling nexmo.verify.check", err);
        throw "error on nexmo.verify.check";
      }

      if (resp.status == "0") {
        this.deleteRequest(deviceKey);
        return null, { data: resp.request_id };
      } else {
        return (
          null,
          {
            status: resp.status,
            message: resp.error_text
          }
        );
      }
    });
  }

  /*
    schema information for nexmo requests:
      table: nexmo_requests
      columns
        - request_id
        - device_key
        - request_status
  */

  async getNexmoRequest(deviceKey) {
    if (!deviceKey) throw "no device key";
    if (!this.pgUrl) throw "no pgUrl set";

    const client = new Client({
      connectionString: this.pgUrl
    });

    try {
      await client.connect();
      const res = await client.query(
        "SELECT request_id FROM nexmo_requests WHERE device_key=$1;",
        [deviceKey]
      );
      return res.rows[0].request_id;
    } catch (e) {
      throw e;
    } finally {
      await client.end();
    }
  }

  async createRequest(deviceKey, requestId, reqStatus) {
    if (!deviceKey) throw "no device key";
    if (!requestId) throw "no nexmo request id";
    if (!reqStatus) throw "no nexmo request status";
    if (!this.pgUrl) throw "no pgUrl set";

    //you can use a connectionString or a normal connection
    const pgClient = new Client({
      connectionString: this.pgUrl
    });

    try {
      await pgClient.connect();
      let qry =
        "INSERT INTO nexmo_requests(device_key, request_id, request_status) VALUES($1, $2, $3);";
      const res = await pgClient.query(qry, [deviceKey, requestId, reqStatus]);
      return;
    } catch (e) {
      throw e;
    } finally {
      await pgClient.end();
    }
  }

  async deleteRequest(deviceKey) {
    if (!deviceKey) throw "no device key";
    if (!this.pgUrl) throw "no pgUrl set";

    const pgClient = new Client({
      connectionString: this.pgUrl
    });

    try {
      await pgClient.connect();
      let qry = "DELETE FROM nexmo_requests WHERE device_key = $1;";
      const res = await pgClient.query(qry, [deviceKey]);
      return;
    } catch (e) {
      throw e;
    } finally {
      await pgClient.end();
    }
  }
}

module.exports = PhoneVerificationMgr;
