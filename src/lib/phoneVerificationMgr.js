import Nexmo from "nexmo";
import { decodeToken, TokenVerifier } from "jsontokens";
import { Client } from 'pg'

class PhoneVerificationMgr {
    constructor() {
        this.api_key = null;
        this.api_secret = null;
        this.pgUrl = null;
        this.from = null;
        this.client = null;
    }

    isSecretsSet() {
        return (this.api_key !== null || this.api_secret !== null || this.from !== null || this.pgUrl !== null);
    }

    setSecrets(secrets) {
        this.api_key = secrets.NEXMO_API_KEY;
        this.api_secret = secrets.NEXMO_SECRET;
        this.from = secrets.NEXMO_FROM;
        this.pgUrl = secrets.PG_URL;
        this.client = new Nexmo({
            apiKey: this.api_key,
            apiSecret: this.api_secret
        }, {
            debug: false,
            appendToUserAgent: "uPort/nisaba"
        });
    }

    async start(deviceKey, phoneNumber) {
        if (!deviceKey) throw "no deviceKey";
        if (!phoneNumber) throw "no destination phoneNumber";
        if (!this.client) throw "client is not initialized";

        let params = {
            number: phoneNumber,
            brand: "uPort",
            code_length: 6
        };

        this.client.verify.request(params, (err, resp) => {
            if (err) {
                console.log("error on nexmo.verify.request", err);
                throw ("error calling nexmo.verify.request");
            }

            console.log("nexmo.status: ", resp.status);
            if (resp.status == "0" || resp.status == "10") {
                //00 > Success - The request was successfully accepted by Nexmo.
                //10 > Concurrent verifications to the same number are not allowed.
                this.createRequest(deviceKey, resp.request_id, resp.status);
                return;
            } else {
                //Basically, an error
                console.log("Nexmo error: ", resp.status, ". Phone: ", phoneNumber)
                return ({
                    message: resp.status,
                    phone: phoneNumber
                });
            }
        });
    }

    async next(deviceKey) {
        return this.control(deviceKey, "trigger_next_event")
    }

    async cancel(deviceKey) {
        return this.control(deviceKey, "cancel")
    }

    async control(deviceKey, command) {
        if (!deviceKey) throw "no deviceKey";
        if (!command) throw "no command";
        if (!this.client) throw "client is not initialized";

        let requestId;
        requestId = this.getRequest(deviceKey)
        if (!requestId) throw "request_id not found"

        let params = {
            request_id: requestId,
            cmd: command
        }

        this.client.verify.control(params, (err, resp) => {
            if (err) {
                console.error("error calling nexmo.verify.control", command, err)
                throw "error on nexmo.verify.control";
            }

            console.log("resp", resp)

            if (resp.status !== '0') {
                console.log("nexmo.status:", resp.status, "error:", resp.error_text)
                return ({
                    status: resp.status,
                    message: resp.error_text
                });
            } else {
                return;
            }
        });
    }

    async check(deviceKey, code) {
        if (!deviceKey) throw "no deviceKey";
        if (!code) throw "no code";
        if (!this.client) throw "client is not initialized";

        let requestId;
        requestId = this.getRequest(deviceKey)
        if (!requestId) throw "request_id not found"

        let params = {
            request_id: requestId,
            code: code
        }

        this.client.verify.check(params, (err, resp) => {
            if (err) {
                console.error("error calling nexmo.verify.check", err)
                throw "error on nexmo.verify.check";
            }

            if (resp.status == '0') {
                this.deleteRequest(deviceKey)
                return ({data: resp.request_id}, null);
            } else {
                return (null, {
                    status: resp.status,
                    message: resp.error_text
                })
            }
        })
    }

    async createRequest(deviceKey, requestId, reqStatus) {
        if (!this.pgUrl) throw ('no pgUrl set')
        if (!this.deviceKey) throw ('no device key')
        if (!this.requestId) throw ('no nexmo request id')
        if (!this.reqStatus) throw ('no nexmo request status')

        const client = new Client({
            connectionString: this.pgUrl,
        })

        try {
            await client.connect()
            let qry = "INSERT INTO nexmo_requests(device_key, request_id, request_status) VALUES($1, $2, $3);"
            const res = await client.query(qry, [deviceKey, requestId, reqStatus]);
            return;
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }
    }

    async getRequest(deviceKey) {
        if (!this.pgUrl) throw ('no pgUrl set')
        if (!this.deviceKey) throw ('no device key')

        const client = new Client({
            connectionString: this.pgUrl,
        })

        try {
            await client.connect()
            let qry = "SELECT request_id FROM nexmo_requests WHERE device_key=$1;"
            const res = await client.query(qry, [deviceKey]);
            return res.rows[0].request_id;
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }
    }

    async deleteRequest(deviceKey) {
        if (!this.pgUrl) throw ('no pgUrl set')
        if (!this.deviceKey) throw ('no devicekey')

        const client = new Client({
            connectionString: this.pgUrl,
        })

        try {
            await client.connect()
            let qry = "DELETE FROM nexmo_requests WHERE device_key = $1;"
            const res = await client.query(qry, [deviceKey]);
            return;
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }
    }

}

module.exports = PhoneVerificationMgr;