# Local Setup
1. Check your node version

   ```node -v```
   
   Make sure you use node 6 (8 might work too). I recommend using nvm (https://github.com/creationix/nvm) to manage different node.js versions (`nvm use 6`).
2. Install serverless

   ```npm install -g serverless```
3. Make sure you have an AWS account. Set up AWS credentials: https://serverless.com/framework/docs/providers/aws/guide/credentials/
4. In IAM management console, create a key for develop: https://console.aws.amazon.com/iam/home#/encryptionKeys/us-west-2

   If you want to deploy to master too, create another key for master.
   Make sure the keys you created are in the correct region (`us-west-2`). If you decide to create keys in another reason, make sure to change region configuration in other places too.
5. Create reCaptcha account: https://www.google.com/recaptcha/admin, get `RECAPTCHA_SECRET_KEY`
6. Create fun captcha account: https://www.funcaptcha.com/setup, get `FUNCAPTCHA_PRIVATE_KEY`.

   (They currently ignore us after we fill in a form, skipp this step for now)
7. Generate Fuel token private & public keys: `FUEL_TOKEN_PRIVATE_KEY`, `FUEL_TOKEN_PUBLIC_KEY`.

   There is nothing special about these keys. They are just `specp256k1` key pair. You can generate them here: https://kjur.github.io/jsrsasign/sample/sample-ecdsa.html
8. Create nextmo account: https://dashboard.nexmo.com/getting-started-guide, get `NEXMO_API_KEY`, `NEXMO_API_SECRET`, `NEXMO_FROM`

   
   
   
   
