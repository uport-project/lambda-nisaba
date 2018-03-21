const PhoneAttestationHandler = require("../phone_attestation");

describe("PhoneAttestationHandler", () => {
  let sut;
  let attestationMgrMock = { attest: jest.fn() };
  let fuelTokenMgrMock = { verifyToken: jest.fn(), decode: jest.fn() };

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
});
