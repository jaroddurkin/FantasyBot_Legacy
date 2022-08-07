const crypto = require('node:crypto');

const ALGORITHM = process.env.CRYPTO_ALGORITHM ? process.env.CRYPTO_ALGORITHM : 'aes-256-ctr';
const KEY = process.env.CRYPTO_KEY ? process.env.CRYPTO_KEY : '11111111222222223333333344444444'; // hardcoded crypto settings for tests

module.exports = {

    encrypt: function(credential) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
        const encrypted = Buffer.concat([cipher.update(credential), cipher.final()]);

        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex'),
        };
    },

    decrypt: function(hash) {
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(hash.iv, 'hex'));
        const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
        return decrypted.toString();
    }
}