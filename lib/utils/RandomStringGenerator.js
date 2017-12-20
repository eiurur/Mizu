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

  static generate(length) {
    const _length = length || 32;
    return randomstring.generate(length);
  }
};
