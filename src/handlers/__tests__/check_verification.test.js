const CheckVerificationHandler = require("../check_verification");

describe("CheckVerificationHandler", () => {
  let sut;
  let phoneVerificationMgrMock = {
    check: jest.fn(() => {
      return Promise.resolve({ data: "data" }, null);
    })
  };
  let fuelTokenMgrMock = {
    newToken: jest.fn()
  };

  beforeAll(() => {
    sut = new CheckVerificationHandler(phoneVerificationMgrMock, fuelTokenMgrMock);
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

  test("no code", done => {
    sut.handle({ deviceKey: "0x1234" }, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(400);
      expect(err.message).toEqual("no code provided");
      done();
    });
  });

  test("happy path", done => {
    sut.handle({ deviceKey: "0x1234", code: "123" }, {}, (err, res) => {
      expect(err).toBeNull();
      done();
    });
  });
});
