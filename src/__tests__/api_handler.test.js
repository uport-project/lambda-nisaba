import AWS from "aws-sdk";
import MockAWS from "aws-sdk-mock";
MockAWS.setSDKInstance(AWS);

const apiHandler = require("../api_handler");

describe("apiHandler", () => {
  beforeAll(() => {
    MockAWS.mock(
      "KMS",
      "decrypt",
      Promise.resolve({
        Plaintext: JSON.stringify({
          FUEL_TOKEN_PRIVATE_KEY: "fakeprivatekey",
          NEXMO_API_KEY: "fakenexmokey",
          NEXMO_API_SECRET: "fakenexmosecret"
        })
      })
    );

    process.env.SECRETS = "fakesecret";
  });

  test("phone_attestation()", done => {
    apiHandler.phone_attestation({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    });
  });

  test("start_verification()", done => {
    apiHandler.start_verification({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    });
  });

  test("continue_verification()", done => {
    apiHandler.continue_verification({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    });
  });

  test("check_verification()", done => {
    apiHandler.check_verification({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    });
  });

  test("newDeviceKey()", done => {
    apiHandler.newDeviceKey({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    });
  });

  test("funcaptcha()", done => {
    apiHandler.funcaptcha({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    });
  });

  test("recaptcha()", done => {
    apiHandler.recaptcha({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    });
  });
});
