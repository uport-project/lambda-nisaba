const DeviceKeyTokenMgr = require('../deviceKeyTokenMgr');

describe('DeviceKeyTokenMgr', () => {
    
    let sut;
    
    beforeAll(() => {
        sut = new DeviceKeyTokenMgr();
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
        expect(sut.verificationKey).toBeNull();
        
    });

    test('is isSecretsSet', () => {
        let secretSet=sut.isSecretsSet()
        expect(secretSet).toEqual(false);
    });

    test('setSecrets', () => {
        expect(sut.isSecretsSet()).toEqual(false);
        sut.setSecrets({FUEL_TOKEN_PUBLIC_KEY: '01234'})
        expect(sut.isSecretsSet()).toEqual(true);
        expect(sut.verificationKey).not.toBeUndefined()
        expect(sut.verificationKey).toEqual('01234')
    });


});