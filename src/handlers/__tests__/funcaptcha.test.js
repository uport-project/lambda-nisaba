const FuncaptchaHandler = require("../funcaptcha");

describe("FuncaptchaHandler", () => {
  let sut;
  let deviceKey = "0x123456";
  let funCaptchaToken = "12345679";
  let funcaptchaMgrMock = {
    verifyToken: jest.fn()
  };
  let fuelTokenMgrMock = {
    newToken: jest.fn()
  };

  beforeAll(() => {
    sut = new FuncaptchaHandler(funcaptchaMgrMock, fuelTokenMgrMock);
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("handle null body", done => {
    sut.handle(undefined, null, (err, res) => {
      expect(err).not.toBeNull();
      expect(err.code).toEqual(400);
      expect(err.message).toEqual("no json body");
      done();
    });
  });

  test("handle empty deviceKey", done => {
    sut.handle(
      {
        funCaptchaToken: funCaptchaToken
      },
      {},
      (err, res) => {
        expect(err).not.toBeNull();
        expect(err.code).toEqual(400);
        expect(err.message).toEqual("no deviceKey");
        done();
      }
    );
  });

  test("handle empty funCaptchaToken", done => {
    sut.handle(
      {
        deviceKey: deviceKey
      },
      {},
      (err, res) => {
        expect(err).not.toBeNull();
        expect(err.code).toEqual(400);
        expect(err.message).toEqual("no funCaptchaToken");
        done();
      }
    );
  });

  test("call funcaptchaMgr.verifyToken()", done => {
    sut.handle(
      {
        deviceKey: deviceKey,
        funCaptchaToken: funCaptchaToken
      },
      {},
      (err, res) => {
        expect(funcaptchaMgrMock.verifyToken).toBeCalled();
        expect(funcaptchaMgrMock.verifyToken).toBeCalledWith(funCaptchaToken);
        done();
      }
    );
  });

  test("call fuelTokenMgr.newToken()", done => {
    funcaptchaMgrMock.verifyToken.mockImplementation(() => {
      return {
        solved: true
      };
    });
    sut.handle(
      {
        deviceKey: deviceKey,
        funCaptchaToken: funCaptchaToken
      },
      {},
      (err, res) => {
        expect(fuelTokenMgrMock.newToken).toBeCalled();
        expect(fuelTokenMgrMock.newToken).toBeCalledWith(deviceKey);
        done();
      }
    );
  });

  test("catch exception", done => {
    funcaptchaMgrMock.verifyToken.mockImplementation(() => {
      throw "throwed error";
    });
    sut.handle(
      {
        deviceKey: deviceKey,
        funCaptchaToken: funCaptchaToken
      },
      {},
      (err, res) => {
        expect(funcaptchaMgrMock.verifyToken).toBeCalled();
        expect(err).not.toBeNull();
        expect(err).toEqual("throwed error");
        done();
      }
    );
  });

  test("catch exception (with message)", done => {
    funcaptchaMgrMock.verifyToken.mockImplementation(() => {
      throw {
        message: "throwed error"
      };
    });
    sut.handle(
      {
        deviceKey: deviceKey,
        funCaptchaToken: funCaptchaToken
      },
      {},
      (err, res) => {
        expect(funcaptchaMgrMock.verifyToken).toBeCalled();
        expect(err).not.toBeNull();
        expect(err).toEqual({
          message: "throwed error"
        });
        done();
      }
    );
  });
});
