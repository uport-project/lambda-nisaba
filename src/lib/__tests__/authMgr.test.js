const AuthMgr = require("../authMgr");

describe("UportMgr", () => {
  let sut;

  let publicKey =
    "03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479";
  let exampleToken =
    "eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
  let event = { headers: { Authorization: "Bearer " + exampleToken } };

  beforeAll(() => {
    sut = new AuthMgr();
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("is isSecretsSet", () => {
    let secretSet = sut.isSecretsSet();
    expect(secretSet).toEqual(false);
  });

  test("verifyNisaba() no headers", done => {
    sut
      .verifyNisaba({})
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no headers");
        done();
      });
  });

  test("verifyNisaba() no authorization header", done => {
    sut
      .verifyNisaba({ headers: { "Content-Type": "application/json" } })
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no Authorization Header");
        done();
      });
  });

  test("verifyNisaba() nisabaPub not set", done => {
    sut
      .verifyNisaba(event)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("nisabaPub not set");
        done();
      });
  });

  test("setSecrets", () => {
    expect(sut.isSecretsSet()).toEqual(false);
    sut.setSecrets({
      FUEL_TOKEN_PUBLIC_KEY: publicKey
    });
    expect(sut.isSecretsSet()).toEqual(true);
  });

  test("verifyNisaba() bad auth format", done => {
    sut
      .verifyNisaba({ headers: { Authorization: "pleaseauthme" } })
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("Format is Authorization: Bearer [token]");
        done();
      });
  });

  test("verifyNisaba() no Bearer keyworkd", done => {
    sut
      .verifyNisaba({ headers: { Authorization: "please authme" } })
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("Format is Authorization: Bearer [token]");
        done();
      });
  });

  test("verifyNisaba() Invalid signature in JWT token", done => {
    sut
      .verifyNisaba(event)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("Invalid signature in JWT token");
        done();
      });
  });
});
