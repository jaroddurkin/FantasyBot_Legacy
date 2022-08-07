const crypto = require('node:crypto');
const crypt = require('../../db/crypt');

describe('encryption module', () => {

    test('encryption works successfully', () => {
        const hash = crypt.encrypt('hello world!');
        expect(hash.iv).toBeDefined();
        expect(hash.content).toBeDefined();
    });

    test('encryption + decryption for short string', () => {
        const hash = crypt.encrypt('a');
        const result = crypt.decrypt(hash);
        expect(result).toBe('a');
    });

    test('encryption + decryption for long string', () => {
        const long = crypto.randomBytes(64).toString('hex');
        const hash = crypt.encrypt(long);
        const result = crypt.decrypt(hash);
        expect(result).toBe(long);
    });
})