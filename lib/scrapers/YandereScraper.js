const path = require('path');
const Scraper = require('./Scraper');
const { service } = require('../configs/service');
const Illust = require('../entities/Illust');
const Logger = require('../utils/Logger');

module.exports = class YandereScraper extends Scraper {
  // CAUTION: dateはmomentのオブジェクト
  // TODO: term, mDateをクラス化
  constructor({ term, date }) {
    super();
    this.term = term;
    this.mDate = date;
  }

  async scrape() {
    const request = this.normalizeRequestOptions();
    const result = await super.fetch({
      url: request.url,
      query: request.query,
    });
    return this.extract(result);
  }

  extract(result) {
    const illusts = [];

    if (result.$('#post-list-posts li').length === 0) {
      return illusts;
    }

    result.$('#post-list-posts li').each(function (idx) {
      const title = result
        .$(this)
        .find('.preview')
        .attr('title');
      const sourceRelative = result
        .$(this)
        .find('.thumb')
        .attr('href');
      const source = `${service.yande_re.domain}${sourceRelative}`;
      const large = result
        .$(this)
        .find('.directlink')
        .attr('href');
      const medium = large.replace(/(image|jpeg)/, 'sample');
      const ext = path.extname(medium);
      if (ext === '.mp4' || ext === '.webm') return; // mp4とWebMは除外

      const illust = new Illust({
        title,
        ext,
        source,
        large,
        medium,
      });
      illusts.push(illust);
    });

    return illusts;
  }

  /**
   * [normalizeRequestOptions description]
   * @return {[type]} [description]
   */
  // normalizeRequestOptions() {
  normalizeRequestOptions() {
    //  day=16&month=2&year=2018
    const url = service.yande_re.endpoint[this.term];
    const [day, week, month] = this.mDate.format('YYYY-MM-DD').split('-');
    const query = {
      day,
      week,
      month,
    };

    const options = {
      url,
      query,
    };

    return options;
  }
};
