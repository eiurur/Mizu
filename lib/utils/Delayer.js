'use strict';

module.exports = class Delayer {
  static delayPromise(ms) {
    // return new Promise( resolve => setTimeout(resolve, ms) );
    return new Promise(function(resolve) { return setTimeout(resolve, ms); });
  }
};
