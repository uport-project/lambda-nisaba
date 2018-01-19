const NewDeviceKeyHandler = require('../newDeviceKey');

describe('NewDeviceKeyHandler', () => {
    
    let sut;
    let deviceKeyTokenMgr={ verifyRequestToken: jest.fn()};
    let fuelTokenMgr={ newToken: jest.fn()};

    beforeAll(() => {
        sut = new NewDeviceKeyHandler(deviceKeyTokenMgr,fuelTokenMgr);
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    test('handle null body', done => {
        sut.handle(null,(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(400)
            expect(err.message).toEqual('no body')
            done();
        })
    });

    test('handle empty requestToken', done => {
        sut.handle({someParam: 'some'},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(400)
            expect(err.message).toEqual('no requestToken')
            done();
        })
    })

    test('handle failed deviceKeyTokenMgr.verifyRequestToken', done => {
        deviceKeyTokenMgr.verifyRequestToken.mockImplementation(()=>{throw({message:'failed'})}) 
        sut.handle({requestToken: 'request.token.fake' },(err,res)=>{
            expect(deviceKeyTokenMgr.verifyRequestToken).toBeCalled();
            expect(deviceKeyTokenMgr.verifyRequestToken).toBeCalledWith('request.token.fake');
            expect(err.code).toEqual(500)
            expect(err.message).toEqual('failed')
            done();
        })
      })

});