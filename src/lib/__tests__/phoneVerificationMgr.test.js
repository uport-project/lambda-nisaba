const PhoneVerificationMgr = require('../phoneVerificationMgr');

describe('PhoneVerificationMgr', () => {

    let sut;
    let phoneNumber;
    let deviceKey;
    let code;
    let nexmoClientMock = {
        verify: jest.fn()
    };
    nexmoClientMock.verify.request = jest.fn();
    nexmoClientMock.verify.control = jest.fn();
    nexmoClientMock.verify.check = jest.fn();

    beforeAll(() => {
        sut = new PhoneVerificationMgr();
        phoneNumber = "+56988425841"
        deviceKey = '0x123456';
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    test('is isSecretsSet', () => {
        let secretSet = sut.isSecretsSet()
        expect(secretSet).toEqual(false);
    });

    test('start() no client set', (done) => {
        sut.start(deviceKey, phoneNumber)
            .then((resp) => {
                fail("shouldn't return");
                done()
            })
            .catch((err) => {
                expect(err).toEqual('client is not initialized')
                done()
            })
    });

    test('setSecrets', () => {
        expect(sut.isSecretsSet()).toEqual(false);
        sut.setSecrets({
            NEXMO_API_KEY: "fakekey",
            NEXMO_SECRET: "fakesecret",
            NEXMO_FROM: "0000",
            PG_URL: "fakeurl"
        })
        sut.client = nexmoClientMock;
        expect(sut.isSecretsSet()).toEqual(true);
        expect(sut.client).not.toBeUndefined()
    });

    test('start() no deviceKey', (done) => {
        sut.start(null)
            .then((resp) => {
                fail("shouldn't return");
                done()
            })
            .catch((err) => {
                expect(err).toEqual('no deviceKey')
                done()
            })
    });

    test('start() no phoneNumber', (done) => {
        sut.start(deviceKey, null)
            .then((resp) => {
                fail("shouldn't return");
                done()
            })
            .catch((err) => {
                expect(err).toEqual('no destination phoneNumber')
                done()
            })
    });

    test('start() happy path', (done) => {
        let params = {
            number: phoneNumber,
            brand: "uPort",
            code_length: 6
        }

        sut.start(deviceKey, phoneNumber)
            .then((err) => {
                expect(nexmoClientMock.verify.request).toBeCalled();
                expect(nexmoClientMock.verify.request).toBeCalledWith(params, expect.anything());
                expect(err).toBeUndefined();
                done();
            })
    });

    test('control() no deviceKey', (done) => {
        sut.start(null)
            .then((resp) => {
                fail("shouldn't return");
                done()
            })
            .catch((err) => {
                expect(err).toEqual('no deviceKey')
                done()
            })
    });

    test('control() no command', (done) => {
        sut.control(deviceKey, null)
            .then((resp) => {
                fail("shouldn't return");
                done()
            })
            .catch((err) => {
                expect(err).toEqual('no command')
                done()
            })
    });

    test('control() happy path', (done) => {
        let cmd = "cancel"
        let params = {
            request_id: "1234",
            cmd: cmd,
        }
        nexmoClientMock.verify.control.mockImplementation(() => {
            return {
                status: '0'
            }
        });
        sut.getRequest = jest.fn();
        sut.getRequest.mockImplementation(() => {
            return "1234"
        });
        sut.control(deviceKey, cmd)
            .then((err) => {
                expect(nexmoClientMock.verify.control).toBeCalled();
                expect(nexmoClientMock.verify.control).toBeCalledWith(params, expect.anything());
                expect(err).toBeUndefined();
                done();
            })
    });

    test('check() no deviceKey', (done) => {
        sut.check(null)
            .then((resp) => {
                fail("shouldn't return");
                done()
            })
            .catch((err) => {
                expect(err).toEqual('no deviceKey')
                done()
            })
    });

    test('check() no code', (done) => {
        sut.check(deviceKey)
            .then((resp) => {
                fail("shouldn't return");
                done()
            })
            .catch((err) => {
                expect(err).toEqual('no code')
                done()
            })
    });


    test('check() happy path', (done) => {
        let code = 100
        let params = {
            request_id: "1234",
            code: code,
        }

        sut.check(deviceKey, code)
            .then((err) => {
                expect(nexmoClientMock.verify.check).toBeCalled();
                expect(nexmoClientMock.verify.check).toBeCalledWith(params, expect.anything());
                expect(err).toBeUndefined()
                done();
            })
    });

});