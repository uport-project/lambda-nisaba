const SmsHandler = require('../sms');


describe('SmsHandler', () => {
    
    let sut;
    let deviceKey='0x123456';
    let phoneNumber='12345679';
    let code='fakecode'
    let codeMgrMock={ getCode: jest.fn()};
    let smsMgrMock={ sendCode: jest.fn()};

    beforeAll(() => {
        sut = new SmsHandler(codeMgrMock,smsMgrMock);
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    test('handle null body', done => {
        sut.handle(null,(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(403)
            expect(err.message).toEqual('no body')
            done();
        })
    });

    test('handle empty deviceKey', done => {
        sut.handle({phoneNumber: phoneNumber},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(403)
            expect(err.message).toEqual('no deviceKey')
            done();
        })
    })

    test('handle empty phoneNumber', done => {
        sut.handle({deviceKey: deviceKey},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(403)
            expect(err.message).toEqual('no phoneNumber')
            done();
        })
    })

    test('call codeMgr.getCode()', done => {
        sut.handle({deviceKey: deviceKey, phoneNumber: phoneNumber },(err,res)=>{
            expect(codeMgrMock.getCode).toBeCalled();
            expect(codeMgrMock.getCode).toBeCalledWith(deviceKey,phoneNumber);
            done();
        })
    })

    test('call smsMgr.sendCode()', done => {
        codeMgrMock.getCode.mockImplementation(()=>code)
        sut.handle({deviceKey: deviceKey, phoneNumber: phoneNumber },(err,res)=>{
            expect(smsMgrMock.sendCode).toBeCalled();
            expect(smsMgrMock.sendCode).toBeCalledWith(code,phoneNumber);
            done();
        })
    })


});