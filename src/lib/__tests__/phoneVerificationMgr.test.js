jest.mock("pg");
import { Client } from "pg";
let pgClientMock = {
  connect: jest.fn(),
  query: jest.fn(() => {
    return Promise.resolve({
      rows: [
        {
          request_id: "1234"
        }
      ]
    });
  }),
  end: jest.fn()
};
Client.mockImplementation(() => {
  return pgClientMock;
});

const PhoneVerificationMgr = require("../phoneVerificationMgr");

describe("PhoneVerificationMgr", () => {
  let sut;
  let phoneNumber = "+56988425841";
  let deviceKey = "0x123456";
  let code;
  let nexmoClientMock = {
    verify: jest.fn()
  };
  nexmoClientMock.verify.request = jest.fn();
  nexmoClientMock.verify.control = jest.fn();
  nexmoClientMock.verify.check = jest.fn();

  beforeAll(() => {
    sut = new PhoneVerificationMgr();
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("is isSecretsSet", () => {
    let secretSet = sut.isSecretsSet();
    expect(secretSet).toEqual(false);
  });

  test("start() no client set", done => {
    sut
      .start(deviceKey, phoneNumber)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("client is not initialized");
        done();
      });
  });

  test("setSecrets", () => {
    expect(sut.isSecretsSet()).toEqual(false);
    sut.setSecrets({
      NEXMO_API_KEY: "fakekey",
      NEXMO_API_SECRET: "fakesecret",
      NEXMO_FROM: "0000",
      PG_URL: "fakeurl"
    });
    sut.nexmo = nexmoClientMock;
    expect(sut.isSecretsSet()).toEqual(true);
    expect(sut.nexmo).not.toBeUndefined();
  });

  test("start() no deviceKey", done => {
    sut
      .start(null)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no deviceKey");
        done();
      });
  });

  test("start() no phoneNumber", done => {
    sut
      .start(deviceKey, null)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no destination phoneNumber");
        done();
      });
  });

  test("start() happy path", done => {
    let params = {
      number: phoneNumber,
      brand: "uPort",
      code_length: 6
    };

    sut.start(deviceKey, phoneNumber).then(err => {
      expect(nexmoClientMock.verify.request).toBeCalled();
      expect(nexmoClientMock.verify.request).toBeCalledWith(
        params,
        expect.anything()
      );
      expect(err).toBeUndefined();
      done();
    });
  });

  test("control() no deviceKey", done => {
    sut
      .start(null)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no deviceKey");
        done();
      });
  });

  test("control() no command", done => {
    sut
      .control(deviceKey, null)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no command");
        done();
      });
  });

  test("control() happy path", done => {
    let cmd = "cancel";
    let params = {
      request_id: "1234",
      cmd: cmd
    };
    nexmoClientMock.verify.control.mockImplementation(() => {
      return {
        status: "0"
      };
    });
    sut.control(deviceKey, cmd).then(err => {
      expect(nexmoClientMock.verify.control).toBeCalled();
      expect(nexmoClientMock.verify.control).toBeCalledWith(
        params,
        expect.anything()
      );
      expect(err).toBeUndefined();
      done();
    });
  });

  test("check() no deviceKey", done => {
    sut
      .check(null)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no deviceKey");
        done();
      });
  });

  test("check() no code", done => {
    sut
      .check(deviceKey)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no code");
        done();
      });
  });

  test("check() happy path", done => {
    let code = 100;
    let params = {
      request_id: "1234",
      code: code
    };

    sut.check(deviceKey, code).then(err => {
      expect(nexmoClientMock.verify.check).toBeCalled();
      expect(nexmoClientMock.verify.check).toBeCalledWith(
        params,
        expect.anything()
      );
      expect(err).toBeUndefined();
      done();
    });
  });

  test("getNexmoRequest() no deviceKey", done => {
    sut
      .getNexmoRequest(null)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no device key");
        done();
      });
  });

  test("createRequest() no deviceKey", done => {
    sut
      .createRequest(null)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no device key");
        done();
      });
  });

  test("createRequest() no requestId", done => {
    sut
      .createRequest(deviceKey)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no nexmo request id");
        done();
      });
  });

  test("createRequest() no reqStatus", done => {
    sut
      .createRequest(deviceKey, 1234)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no nexmo request status");
        done();
      });
  });

  test("createRequest() happy path", done => {
    pgClientMock.connect = jest.fn();
    pgClientMock.connect.mockClear();
    pgClientMock.end.mockClear();
    pgClientMock.query.mockClear();
    pgClientMock.query = jest.fn(() => {
      return Promise.resolve({ rows: ["ok"] });
    });

    sut
      .createRequest(deviceKey, 1234, "0")
      .then(resp => {
        expect(pgClientMock.connect).toBeCalled();
        expect(pgClientMock.query).toBeCalled();
        expect(pgClientMock.query).toBeCalledWith(
          "INSERT INTO nexmo_requests(device_key, request_id, request_status) VALUES($1, $2, $3);",
          [deviceKey, 1234, "0"]
        );
        expect(pgClientMock.end).toBeCalled();
        done();
      })
      .catch(err => {
        fail(err);
        done();
      });
  });

  test("deleteRequest() no deviceKey", done => {
    sut
      .deleteRequest()
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no device key");
        done();
      });
  });

  test("deleteRequest() happy path", done => {
    pgClientMock.connect = jest.fn();
    pgClientMock.connect.mockClear();
    pgClientMock.end.mockClear();
    pgClientMock.query.mockClear();
    pgClientMock.query = jest.fn(() => {
      return Promise.resolve({ rows: ["ok"] });
    });

    sut
      .deleteRequest(deviceKey, 1234, "0")
      .then(resp => {
        expect(pgClientMock.connect).toBeCalled();
        expect(pgClientMock.query).toBeCalled();
        expect(pgClientMock.query).toBeCalledWith(
          "DELETE FROM nexmo_requests WHERE device_key = $1;",
          [deviceKey]
        );
        expect(pgClientMock.end).toBeCalled();
        done();
      })
      .catch(err => {
        fail(err);
        done();
      });
  });
});
