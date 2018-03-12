const RecaptchaMgr = require('../recaptchaMgr');

describe('RecaptchaMgr', () => {

    let sut;

    beforeAll(() => {
        sut = new RecaptchaMgr();
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

});