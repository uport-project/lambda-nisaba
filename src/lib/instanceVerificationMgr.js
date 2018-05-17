import rp from "request-promise";

class InstanceVerificationMgr {
    constructor() {
      this.google_api_key = null;
      this.google_project_id = null;
    }

    setSecrets(secrets) {
        this.google_api_key = secrets.GOOGLE_API_KEY;
        this.google_project_id = secrets.GOOGLE_PROJECT_ID;
    }

    isSecretsSet() {
        return (
            this.google_api_key !== null &&
            this.google_project_id !== null
          )
    }


    //an example token detail is this:
    // {
    //     "applicationVersion": "1",
    //     "connectDate": "2018-04-20",
    //     "attestStatus": "UNKNOWN",
    //     "application": "com.example.iid.test",
    //     "scope": "somedAppMnid",
    //     "authorizedEntity": "856113207441",
    //     "connectionType": "MOBILE",
    //     "appSigner": "81bca393436fb4d743af862779ce7aaaf94696e2",
    //     "platform": "ANDROID"
    // }

    async getInstanceTokenDetails(instanceToken) {
        if (!instanceToken) throw "missing instance token"

        var iid_options = {
            uri: `https://iid.googleapis.com/iid/info/${instanceToken}?details=true`,
            method: 'GET',
            headers: {
                'Authorization': `key=${this.google_api_key}`
            },
            json: true
        }

        let resp = await rp(iid_options);
        return JSON.parse(resp);
    }

    async checkInstanceDetails(iid_resp) {

        if (iid_resp.authorizedEntity !== this.google_project_id) {
            throw "token is generated for a different entity. Only uPort SDK instance tokens accepted."
        }

        var dAppMnid = iid_resp.scope // to be used for rate limiting

        var dAppDDO = getDappDetails(dAppMnid)

        // ANDROID or IOS
        var platform = iid_resp.platform

        //this is the applicationId for ANDROID and bundleId for iOS
        // this should be checked against the corresponding field in the dApp doc from IPFS
        var appId = iid_resp.application

        //this is the fingerprint of the android signature.
        // this field should be checked against the list of fingerprints from the dApp doc from IPFS
        var appFingerprint = iid_resp.appSigner
        
        //TODO: after appmanager fields are added, make the actual checks here

        return true
    }

    async getDappDetails(dAppMnid) {
        //TODO: obtain the dApp details from ipfs

/**
 * example dApp details:
 * 
 *   {
 *       publicKey : "0x04b235d4d3247b178f1d03cb02543af7cdbc7862a2e644dbd2400d3c909b932a692b8ee00d1505f22ebb7e30d883d3f3052bf88799e59f051b0cc1e7bcd238075c",
 *       appId : "com.uportMobile.iid.test",
 *       bundleId : "me.uport.iid.test",
 *       fingerprints : [
 *            // fingerprint can heve 2 forms
 *           "81bca393436fb4d743af862779ce7aaaf94696e2",
 *           "81:BC:A3:93:43:6F:B4:D7:43:AF:86:27:79:CE:7A:AA:F9:46:96:E2"
 *       ]
 *   }
 * 
 */
    }
}


module.exports = InstanceVerificationMgr;