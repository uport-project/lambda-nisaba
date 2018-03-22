const StartVerificationHandler = require("../start_verification");

describe("StartVerificationHandler", () => {
  let sut;
  let phoneVerificationMgrMock = { start: jest.fn() };

  beforeAll(() => {
    sut = new StartVerificationHandler(phoneVerificationMgrMock);
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
      expect(err.message).toEqual("no deviceKey provided");
      done();
    });
  });

  test("no phoneNumber", done => {
    sut.handle({ deviceKey: "0x1234" }, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(400);
      expect(err.message).toEqual("no phoneNumber provided");
      done();
    });
  });

  test("happy path", done => {
    sut.handle(
      { deviceKey: "0x1234", phoneNumber: "98765432" },
      {},
      (err, res) => {
        expect(err).toBeNull();
        done();
      }
    );
  });
});
