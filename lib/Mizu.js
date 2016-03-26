'use strict';

const DanbooruScraper       = require('./scrapers/DanbooruScraper');
const SankakuComplexScraper = require('./scrapers/SankakuComplexScraper');
const YandereScraper        = require('./scrapers/YandereScraper');

module.exports = class Mizu {
  static createScpraper(params) {
    switch (params.name) {
      case 'danbooru': return new DanbooruScraper(params);
      case 'sankaku_complex': return new SankakuComplexScraper(params);
      case 'yande_re': return new YandereScraper(params);
      default: return null;
    }
  }
};
