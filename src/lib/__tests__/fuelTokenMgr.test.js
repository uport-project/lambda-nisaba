
const FuelTokenMgr = require('../fuelTokenMgr');

describe('FuelTokenMgr', () => {
    let sut;

    beforeAll(() => {
        sut = new FuelTokenMgr();
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

});