const NewDeviceKeyHandler = require('../newDeviceKey');

describe('NewDeviceKeyHandler', () => {
    
    let sut;
    let authMgr={ verifyNisaba: jest.fn()};
    let uPortMgr={ verifyToken: jest.fn()};
    let fuelTokenMgr={ newToken: jest.fn()};

    beforeAll(() => {
        sut = new NewDeviceKeyHandler(authMgr,uPortMgr,fuelTokenMgr);
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    test('handle failed authMgr.verifyNisaba', done => {
        authMgr.verifyNisaba.mockImplementation(()=>{
            throw("throwed error")
        });
        sut.handle(null,{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(401)
            expect(err.message).toEqual('throwed error')
            done();
        })
    });


    test('handle null body', done => {
        authMgr.verifyNisaba.mockImplementation(()=>{
            return {sub: '0xfuelTokenAddress'}
        });
        sut.handle(null,{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(400)
            expect(err.message).toEqual('no json body')
            done();
        })
    });

    test('handle empty requestToken', done => {
        sut.handle({someParam: 'some'},{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(400)
            expect(err.message).toEqual('requestToken parameter missing')
            done();
        })
    })

    test('handle failed uPortMgr.verifyToken', done => {
        uPortMgr.verifyToken.mockImplementation(()=>{throw({message:'failed'})}) 
        sut.handle({requestToken: 'request.token.fake' },{},(err,res)=>{
            expect(uPortMgr.verifyToken).toBeCalled();
            expect(uPortMgr.verifyToken).toBeCalledWith('request.token.fake');
            expect(err.code).toEqual(500)
            expect(err.message).toEqual('failed')
            done();
        })
      })

});