const FuncaptchaMgr = require("../funcaptchaMgr");

describe("FuncaptchaMgr", () => {
  let sut;

  beforeAll(() => {
    sut = new FuncaptchaMgr();
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("is isSecretsSet", () => {
    let secretSet = sut.isSecretsSet();
    expect(secretSet).toEqual(false);
  });

  test("verifyToken() no funCaptchaToken", done => {
    sut
      .verifyToken()
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no funCaptchaToken");
        done();
      });
  });

  test("verifyToken() no funcaptchaPrivateKey set", done => {
    sut
      .verifyToken("faketoken")
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no funcaptchaPrivateKey set");
        done();
      });
  });

  test("setSecrets", () => {
    expect(sut.isSecretsSet()).toEqual(false);
    sut.setSecrets({ FUNCAPTCHA_PRIVATE_KEY: "fakekey" });
    expect(sut.isSecretsSet()).toEqual(true);
  });
});
