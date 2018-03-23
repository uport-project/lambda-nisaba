const ContinueVerificationHandler = require("../continue_verification");

describe("ContinueVerificationHandler", () => {
  let sut;
  let phoneVerificationMgrMock = { next: jest.fn() };

  beforeAll(() => {
    sut = new ContinueVerificationHandler(phoneVerificationMgrMock);
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

  test("no deviceKey", done => {
    sut.handle({}, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(400);
      expect(err.message).toEqual("no device_key or device_key null");
      done();
    });
  });

  test("happy path", done => {
    sut.handle({ pathParameters: { deviceKey: "0x1234" } }, {}, (err, res) => {
      expect(err).toBeNull();
      done();
    });
  });
});
