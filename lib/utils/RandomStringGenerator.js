const crypto = require('crypto');
const randomstring = require('randomstring');

module.exports = class RandomStringGenerator {
  static createHash(key, algorithm) {
    const _algorithm = algorithm || 'sha256';
    return crypto
      .createHash(_algorithm)
      .update(key)
      .digest('hex');
  }

  static createHashWithPayload(key, algorithm) {
    const _algorithm = algorithm || 'sha256';
    return crypto
      .createHash(_algorithm)
      .update(key, 'utf-8')
      .digest('hex');
  }

  static generate(length = 32) {
    return randomstring.generate(length);
  }
};
