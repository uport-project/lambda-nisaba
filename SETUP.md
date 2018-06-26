# Local Setup
1. Check your node version

   ```node -v```
   
   Make sure you use node 8.10 (I tried node 6, `npm test` fails with syntax error). 
   
   I recommend using nvm (https://github.com/creationix/nvm) to manage different node.js versions (`nvm install 8.10; nvm use 8.10`).
2. Install serverless

   ```npm install -g serverless```
3. Install all dependencies

   ```npm install```

   run `npm test`, the tests should all pass.
4. Make sure you have an AWS account. Set up AWS credentials: https://serverless.com/framework/docs/providers/aws/guide/credentials/

   In this step, make sure your `~/.aws/credentials` is setup correctly. And you exported your environment variables:
   
   ```
   export AWS_ACCESS_KEY=[AWS_ACCESS_KEY]
   export AWS_SECRET_ACCESS_KEY=[AWS_SECRET_ACCESS_KEY]
   ```
5. In IAM management console, create a key for develop: https://console.aws.amazon.com/iam/home#/encryptionKeys/us-west-2

   If you want to deploy to master too, create another key for master.
   Make sure the keys you created are in the correct region (`us-west-2`). If you decide to create keys in another region, make sure to change region configuration in other places too.
6. Create reCaptcha account: https://www.google.com/recaptcha/admin, get `RECAPTCHA_SECRET_KEY`

   (You only need to set this up if you want to use the reCAPTCHA verification flow, not needed for phone verification flow)
7. Create fun captcha account: https://www.funcaptcha.com/setup, get `FUNCAPTCHA_PRIVATE_KEY`.

   (They currently ignore us after we fill in a form, skip this step for now; this is also not needed for phone verification flow)
8. Generate Fuel token private & public keys and address: `FUEL_TOKEN_PRIVATE_KEY`, `FUEL_TOKEN_PUBLIC_KEY`, `FUEL_TOKEN_ADDRESS`.

   Create an app e.g. nisaba on uport app manager: https://appmanager.uport.me/, you can see the ```address``` and ```public key``` (remove the `0x`) listed there. Click `click here for app code`, you can get the ```private key``` inside ```SimpleSinger```.
9. If you want the JWT payload aud to be another app rather than this one, you can create an app e.g. sensui on uport app manager: https://appmanager.uport.me/, get the ```address``` for ```AUDIENCE_ADDRESS```.

     Note: for step 8 and 9, you can also generate these keys using https://github.com/uport-project/uport-cli-client. If in doubt, you can append ```did:uport:``` to the ```address``` (mnid) and test it out in the uport did resolver: http://uportdid.radicalledger.com/.
10. Create nexmo account: https://dashboard.nexmo.com/getting-started-guide, get `NEXMO_API_KEY`, `NEXMO_API_SECRET`, `NEXMO_FROM`

     You can find `NEXMO_FROM` in the dashboard, 'Numbers -> Your numbers' section.
11. Setup PostgreSQL locally
    
    Start server: `pg_ctl -D /usr/local/var/postgres start &`
    (Stop server: `pg_ctl -D /usr/local/var/postgres stop`)
    
    You need create a table `nexmo_requests`:
    
    ```
    CREATE TABLE public.nexmo_requests
    (
      device_key VARCHAR(64),
      request_id VARCHAR(32),
      request_status VARCHAR(32)
    )
    WITH (
      OIDS=FALSE
    );
    ```
   
      In this case `PG_URL=postgresql://localhost`
12. Delete the old `kms-secrets.develop.us-west-2.yml` and `kms-secrets.master.us-west-2.yml`. 

      Generate your own using the following command:

      ```sls encrypt -n SECRETS:[variable] -v [value] [-k key_for_stage] [-s stage]```
   
      Use the key you generated in step 5 to replace `key_for_stage`, and specify `develop` for `stage`. The first time you run the command, a file `kms-secrets.develop.us-west-2.yml` will be generated.
 
      If you want to deploy to master, use the other key you generated in step 5 to replace `key_for_stage`, and specify `master` for `stage`, a file `kms-secrets.master.us-west-2.yml` will be generated.
   
      You only need to specify `[-k key_for_stage]` the first time you run the command for each stage.
   
      You should encrypt the following `variable` and its corresponding `value`. If you followed step 6 to 10, you'll know what those values are.
      ```
      RECAPTCHA_SECRET_KEY
      FUNCAPTCHA_PRIVATE_KEY
      FUEL_TOKEN_PRIVATE_KEY
      FUEL_TOKEN_PUBLIC_KEY
      FUEL_TOKEN_ADDRESS
      AUDIENCE_ADDRESS
      NEXMO_API_KEY
      NEXMO_API_SECRET
      NEXMO_FROM
      PG_URL
      ```
   
      Run `sls decrypt` to check the encryption works correctly.
13. Now you can run locally

      ```sls invoke local -f [function] -d [data]```
      
      
      test the following **Phone Verification Flow**
      
      Use this to generate keys: https://github.com/uport-project/uport-cli-client
 
      After `uPort Identity Created!`, the console will print out a `UPortClient` object. Use `UPortClient.deviceKeys.address` as `deviceKey`. (remember `UPortClient.deviceKeys.privateKey` and `UPortClient.mnid`).
      
      - start verification:
      
         ```sls invoke local -f start -d '{"deviceKey": [deviceKey], "phoneNumber":[your phone number]}'```

         Send a code through SMS or Call

      - continue verification
        
        (This step is optional, it is for user who has previously indicated they prefer to recieve a code via text-to-speech, you'll receive a phone call.)
 
         ```sls invoke local -f next -d '{"pathParameters": {"deviceKey": [deviceKey]}}'```
 
       - verify code and get fuelToken
 
         ```sls invoke local -f check -d '{"deviceKey":[deviceKey], "code": [code you received]}'```
         you'll receive a fuelToken
       - get new fuelToken with new deviceKey

         Once you already get a fuelToken, if you have a new deviceKey, you don't need to go through the above phone verification flow anymore, you can generate a new fuelToken with the old fuelToken and the new deviceKey.
         
         You'll need to generate a requestToken as follows:
         ```
         const createJWT = require('did-jwt').createJWT;
         const SimpleSigner = require('did-jwt').SimpleSigner;

         const signer = new SimpleSigner(UPortClient.deviceKeys.privateKey.slice(2));
         const issuer = UPortClient.mnid;

         const now = Math.floor(Date.now() / 1000);
         const aud = secrets.AUDIENCE_ADDRESS;

         const requestToken = await createJWT(
           {
             aud,
             exp: now + 300,
             iat: now,
             newDeviceKey: newDeviceKey
           },
           { issuer, signer }
         );
         ``` 
 
         ```sls invoke local -f newDeviceKey -d '{"headers: {"Authorization": "bearer [old fuelToken]"}, requestToken": [requestToken]}'```
 
         You'll get a new fuelToken.
