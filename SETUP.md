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
5. In IAM management console, create a key for develop: https://console.aws.amazon.com/iam/home#/encryptionKeys/us-west-2

   If you want to deploy to master too, create another key for master.
   Make sure the keys you created are in the correct region (`us-west-2`). If you decide to create keys in another reason, make sure to change region configuration in other places too.
6. Create reCaptcha account: https://www.google.com/recaptcha/admin, get `RECAPTCHA_SECRET_KEY`
7. Create fun captcha account: https://www.funcaptcha.com/setup, get `FUNCAPTCHA_PRIVATE_KEY`.

   (They currently ignore us after we fill in a form, skipp this step for now)
8. Generate Fuel token private & public keys: `FUEL_TOKEN_PRIVATE_KEY`, `FUEL_TOKEN_PUBLIC_KEY`.

   There is nothing special about these keys. They are just `specp256k1` key pair. You can generate them here: https://kjur.github.io/jsrsasign/sample/sample-ecdsa.html
9. Create nextmo account: https://dashboard.nexmo.com/getting-started-guide, get `NEXMO_API_KEY`, `NEXMO_API_SECRET`, `NEXMO_FROM`
10. Setup postgres
11. Delete the old `kms-secrets.develop.us-west-2.yml` and `kms-secrets.master.us-west-2.yml`. Generate your own using the following command:

   ```sls encrypt -n SECRETS:[variable] -v [value] [-k key_for_stage] [-s stage]```
   
   Use the key you generated in step 5 to replace `key_for_stage`, and specify `develop` for `stage`. The first time you run the command, a file `kms-secrets.develop.us-west-2.yml` will be generated.
 
   If you want to deploy master, use the other key you generated in step 5 to replace `key_for_stage, and specify `master` for `stage`, a file `kms-secrets.master.us-west-2.yml` will be generated.
   
   You only need to specify `[-k key_for_stage]` the first time you run the command for each stage.
   
   You should encrypt the following `variables` and its corresponding `values`. If you followed step 6 to 10, you'll know what those values are.
   ```
   RECAPTCHA_SECRET_KEY
   FUNCAPTCHA_PRIVATE_KEY
   FUEL_TOKEN_PRIVATE_KEY
   FUEL_TOKEN_PUBLIC_KEY
   NEXMO_API_KEY
   NEXMO_API_SECRET
   NEXMO_FROM
   PG_URL
   ```
   
   Run `sls decrypt` to check the encryption works correctly.
12. Now you can run locally

   ```sls invoke local -f [function] -d [data]```
   
   
   
   
