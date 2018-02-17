const xa = require('xa');

module.exports = class Logger {
  static dump(obj) {
    xa.on('Logger.dump', new Date());
    Object.keys(obj).map(key => xa.info(key, obj[key]));
  }
};
