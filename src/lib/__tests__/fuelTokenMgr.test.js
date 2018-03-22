const FuelTokenMgr = require("../fuelTokenMgr");

describe("FuelTokenMgr", () => {
  let sut;
  let deviceKey = "0x1234";
  let ftPrivKey =
    "278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f";
  let ftPubKey =
    "03fdd57adec3d438ea237fe46b33ee1e016eda6b585c3e27ea66686c2ea5358479";

  beforeAll(() => {
    sut = new FuelTokenMgr();
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("is isSecretsSet", () => {
    let secretSet = sut.isSecretsSet();
    expect(secretSet).toEqual(false);
  });

  test("setSecrets", () => {
    expect(sut.isSecretsSet()).toEqual(false);
    sut.setSecrets({
      FUEL_TOKEN_PRIVATE_KEY: ftPrivKey,
      FUEL_TOKEN_PUBLIC_KEY: ftPubKey
    });
    expect(sut.isSecretsSet()).toEqual(true);
  });

  test("newToken() happy path", done => {
    const DATE_TO_USE = new Date("2017-12-15T22:41:20");
    Date.now = jest.genMockFunction().mockReturnValue(DATE_TO_USE);
    sut.newToken(deviceKey).then(resp => {
      expect(resp.substr(0, 40)).toEqual(
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.e"
      );
      done();
    });
  });
});
