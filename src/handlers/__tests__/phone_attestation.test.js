const PhoneAttestationHandler = require("../phone_attestation");

describe("PhoneAttestationHandler", () => {
  let sut;
  let attestationMgrMock = { attest: jest.fn() };
  let fuelTokenMgrMock = { verifiy: jest.fn(), decode: jest.fn() };
  let token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiIyb3NxUFpHOFF0UXpYVFBiTEo0Z1hNcmJKS2E4dkpHZk5wRCIsImlhdCI6MTUxNzM5NDM3OCwibmV3RGV2aWNlS2V5IjoiMHhhYWFhIiwiZXhwIjoxNTE3NDgwNzc4fQ.QAjMrqkmcyls3nNfIqSfrT21-FTdnxJTgTWk0wOJ_AD-B7XV280lHiqwm0ckL51YEm2gTgAdQEgzq1OF8NbvmQ";

  beforeAll(() => {
    sut = new PhoneAttestationHandler(attestationMgrMock, fuelTokenMgrMock);
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("handle null body", done => {
    sut.handle(null, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(400);
      expect(err.message).toEqual("no json body");
      done();
    });
  });

  test("handle empty token", done => {
    sut.handle({}, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(400);
      expect(err.message).toEqual("no fuelToken provided");
      done();
    });
  });

  test("no uPortID on the fuelToken", done => {
    fuelTokenMgrMock.verifiy.mockImplementation(() => {
      return true;
    });
    fuelTokenMgrMock.decode.mockImplementation(() => {
      return { payload: { phoneNumber: "987654321" } };
    });
    sut.handle(
      {
        body: JSON.stringify({ token: token })
      },
      {},
      (err, res) => {
        expect(err).not.toBeNull();
        expect(err.code).toEqual(400);
        expect(err.message).toEqual("no uPortId provided");
        done();
      }
    );
  });

  test("happy path", done => {
    fuelTokenMgrMock.verifiy.mockImplementation(() => {
      return true;
    });
    fuelTokenMgrMock.decode.mockImplementation(() => {
      return { payload: { phoneNumber: "987654321" } };
    });
    sut.handle(
      {
        body: JSON.stringify({ token: token, uportId: "233123123" })
      },
      {},
      (err, res) => {
        expect(err).toBeNull();
        done();
      }
    );
  });
});
