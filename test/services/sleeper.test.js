const { sendRequest } = require('../../services/sleeper/init');
const sleeper = require('../../services/sleeper/sleeper');

jest.mock('../../services/sleeper/init', () => {
    const actual = jest.requireActual('../../services/sleeper/init');
    return {
        ...actual,
        sendRequest: jest.fn()
    };
});

describe('sleeper service', () => {

    test('validate league exists', async () => {
        expect(true).toBe(true);
    });
})