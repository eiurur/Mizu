'use strict';

const DanbooruScraper         = require('./scrapers/DanbooruScraper');
const YandereScraper          = require('./scrapers/YandereScraper');
const SankakuComplexRequester = require('./requesters/SankakuComplexRequester');

module.exports = class Mizu {

  /**
   * TODO: 命名がバラバラなので統一したい。
   * [createCrawler description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  static createCrawler(params) {
    switch (params.name) {
      case 'danbooru': return new DanbooruScraper(params);
      case 'sankaku_complex': return new SankakuComplexRequester(params);
      case 'yande_re': return new YandereScraper(params);
      default: return null;
    }
  }
};
