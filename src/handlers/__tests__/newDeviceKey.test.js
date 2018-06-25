const NewDeviceKeyHandler = require("../newDeviceKey");

describe("NewDeviceKeyHandler", () => {
  let sut;
  let authMgr = { verifyNisaba: jest.fn() };
  let requestTokenMgr = { verifyToken: jest.fn() };
  let fuelTokenMgr = { newToken: jest.fn(), verifyToken: jest.fn() };

  beforeAll(() => {
    sut = new NewDeviceKeyHandler(authMgr, requestTokenMgr, fuelTokenMgr);
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("handle failed authMgr.verifyNisaba", done => {
    authMgr.verifyNisaba.mockImplementation(() => {
      throw "throwed error";
    });
    sut.handle(null, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(401);
      expect(err.message).toEqual("throwed error");
      done();
    });
  });

  test("handle null body", done => {
    authMgr.verifyNisaba.mockImplementation(() => {
      return { sub: "0xfuelTokenAddress" };
    });
    sut.handle(null, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(400);
      expect(err.message).toEqual("no json body");
      done();
    });
  });

  test("handle empty requestToken", done => {
    sut.handle({ someParam: "some" }, {}, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(400);
      expect(err.message).toEqual("requestToken parameter missing");
      done();
    });
  });

  test("handle failed requestTokenMgr.verifyToken", done => {
    requestTokenMgr.verifyToken.mockImplementation(() => {
      throw { message: "failed" };
    });
    sut.handle({ requestToken: "request.token.fake" }, {}, (err, res) => {
      expect(requestTokenMgr.verifyToken).toBeCalled();
      expect(requestTokenMgr.verifyToken).toBeCalledWith("request.token.fake");
      expect(err.code).toEqual(500);
      expect(err.message).toEqual("failed");
      done();
    });
  });
});
