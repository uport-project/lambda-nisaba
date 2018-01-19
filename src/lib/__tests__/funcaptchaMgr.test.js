const FuncaptchaMgr = require('../funcaptchaMgr');

describe('FuncaptchaMgr', () => {
    
    let sut;
    
    beforeAll(() => {
        sut = new FuncaptchaMgr();
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

});