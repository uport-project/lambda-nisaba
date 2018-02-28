const RecaptchaHandler = require('../recaptcha');

describe('RecaptchaHandler', () => {
    
    let sut;
    let deviceKey='0x123456';
    let reCaptchaToken='12345679';
    let recaptchaMgrMock={ verifyToken: jest.fn()};
    let fuelTokenMgrMock={ newToken: jest.fn()};

    beforeAll(() => {
        sut = new RecaptchaHandler(recaptchaMgrMock,fuelTokenMgrMock);
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    test('handle null body', done => {
        sut.handle(null,{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(400)
            expect(err.message).toEqual('no json body')
            done();
        })
    });

    test('handle empty deviceKey', done => {
        sut.handle({reCaptchaToken: reCaptchaToken},{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(400)
            expect(err.message).toEqual('no deviceKey')
            done();
        })
    })

    test('handle empty reCaptchaToken', done => {
        sut.handle({deviceKey: deviceKey},{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(400)
            expect(err.message).toEqual('no reCaptchaToken')
            done();
        })
    })

    test('call recaptchaMgr.verifyToken()', done => {
        sut.handle({deviceKey: deviceKey, reCaptchaToken: reCaptchaToken },{},(err,res)=>{
            expect(recaptchaMgrMock.verifyToken).toBeCalled();
            expect(recaptchaMgrMock.verifyToken).toBeCalledWith(reCaptchaToken);
            done();
        })
    })

    test('call fuelTokenMgr.newToken()', done => {
        recaptchaMgrMock.verifyToken.mockImplementation(()=>{ return {success: true} })
        sut.handle({deviceKey: deviceKey, reCaptchaToken: reCaptchaToken },{},(err,res)=>{
            expect(fuelTokenMgrMock.newToken).toBeCalled();
            expect(fuelTokenMgrMock.newToken).toBeCalledWith(deviceKey);
            done();
        })
    })

    test('catch exception', done => {
        recaptchaMgrMock.verifyToken.mockImplementation(()=>{
            throw("throwed error")
        });
        sut.handle({deviceKey: deviceKey, reCaptchaToken: reCaptchaToken },{},(err,res)=>{
            expect(recaptchaMgrMock.verifyToken).toBeCalled();
            expect(err).not.toBeNull()
            expect(err).toEqual('throwed error')
            done();
        })
    })

    test('catch exception (with message)', done => {
        recaptchaMgrMock.verifyToken.mockImplementation(()=>{
            throw({message:"throwed error"})
        });
        sut.handle({deviceKey: deviceKey, reCaptchaToken: reCaptchaToken },{},(err,res)=>{
            expect(recaptchaMgrMock.verifyToken).toBeCalled();
            expect(err).not.toBeNull()
            expect(err).toEqual({"message": "throwed error"})
            done();
        })
    })


});