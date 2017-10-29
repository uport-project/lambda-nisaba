jest.mock('pg')
import { Client } from 'pg'
let pgClientMock={
    connect:jest.fn(),
    end:jest.fn()
}
Client.mockImplementation(()=>{return pgClientMock});
const CodeMgr = require('../codeMgr');

describe('CodeMgr', () => {
    
    let sut;
    let deviceKey='0x123456';
    let phoneNumber='12345679';
    let code='fakeCode';

    beforeAll(() => {
        sut = new CodeMgr();
        pgClientMock.query=jest.fn(()=>{ return { rows: [{ 'code': code}] }})
        
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    test('is isSecretsSet', () => {
        let secretSet=sut.isSecretsSet()
        expect(secretSet).toEqual(false);
    });

    test('getCode no pgUrl set', (done) =>{
        sut.getCode(deviceKey,phoneNumber)
        .then((resp)=> {
            fail("shouldn't return"); done()
        })
        .catch( (err)=>{
            expect(err).toEqual('no pgUrl set')
            done()
        })
    });

    test('setSecrets', () => {
        expect(sut.isSecretsSet()).toEqual(false);
        sut.setSecrets({PG_URL: 'fake'})
        expect(sut.isSecretsSet()).toEqual(true);
    });

    test('getCode no deviceKey', (done) =>{
        sut.getCode(null,phoneNumber)
        .then((resp)=> {
            fail("shouldn't return"); done()
        })
        .catch( (err)=>{
            expect(err).toEqual('no deviceKey')
            done()
        })
    });

    test('getCode no phoneNumber', (done) =>{
        sut.getCode(deviceKey,null)
        .then((resp)=> {
            fail("shouldn't return"); done()
        })
        .catch( (err)=>{
            expect(err).toEqual('no phoneNumber')
            done()
        })
    });

    test('getCode ..', (done) =>{
        sut.getCode(deviceKey,phoneNumber)
        .then((resp)=> {
            expect(pgClientMock.connect).toHaveBeenCalledTimes(1);
            expect(pgClientMock.query).toHaveBeenCalledTimes(1);
            expect(pgClientMock.query).toBeCalledWith(
                "SELECT * FROM verifications WHERE active='true'::boolean AND device_key=$1 AND phone_number=$2",
                [deviceKey,phoneNumber]);
            expect(pgClientMock.end).toHaveBeenCalledTimes(1);
            expect(resp).toEqual({code: code})
            done()
        })
        .catch( (err)=>{
            fail(err)
            done()
        })
    });

})