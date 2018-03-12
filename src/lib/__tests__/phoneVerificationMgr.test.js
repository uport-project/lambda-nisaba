const PhoneVerificationMgr = require('../phoneVerificationMgr');

describe('PhoneVerificationMgr', () => {

    let sut;
    let phoneNumber;
    let deviceKey;
    let code;
    let nexmoClientMock = {
        verify: jest.fn({
            request: jest.fn(),
        }),
    };

    beforeAll(() => {
        sut = new PhoneVerificationMgr();
        sut.client = nexmoClientMock;
        phoneNumber = "+56988425841"
        deviceKey = '0x123456';
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    test('start() no deviceKey', (done) => {
        sut.start(null)
            .then((resp) => {
                fail("shouldn't return"); done()
            })
            .catch((err) => {
                expect(err).toEqual('no deviceKey')
                done()
            })
    });

    test('start() no phoneNumber', (done) => {
        sut.start(deviceKey, null)
            .then((resp) => {
                fail("shouldn't return"); done()
            })
            .catch((err) => {
                expect(err).toEqual('no destination phoneNumber')
                done()
            })
    });

    test.skip('start() happy path', (done) => {

        let params = {
            number: phoneNumber,
            brand: "uPort",
            code_length: 6
        }

        sut.start(deviceKey, phoneNumber)
            .then((err) => {
                expect(nexmoClientMock.verify).toBeCalled();
                expect(nexmoClientMock.verify.request).toBeCalled();
                expect(nexmoClientMock.verify.request).toBeCalledWith(params);
                expect(err).toBeNull();
                done();
            })
    });

});