const path = require('path');
const Scraper = require('./commons/Scraper');
const { service } = require('../configs/service');
const Illust = require('../entities/Illust');
const Logger = require('../utils/Logger');

/**
 * MEMO
 *
 * day
 * https://danbooru.donmai.us/explore/posts/popular?date=2016-03-26&scale=day
 *
 * week
 * https://danbooru.donmai.us/explore/posts/popular?date=2016-03-26&scale=week
 *
 * month
 * https://danbooru.donmai.us/explore/posts/popular?date=2016-03-26&scale=month
 */
module.exports = class DanbooruScraper extends Scraper {
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

    if (result.$('#c-explore-posts article').length === 0) {
      return illusts;
    }

    result.$('#c-explore-posts article').each(function (idx) {
      const title = result.$(this).data('tags');

      const sourceRelative = result.$(this).find('a').attr('href');

      const source = `${service.danbooru.domain}${sourceRelative}`;
      const large = result.$(this).data('file-url');
      const medium = result.$(this).data('large-file-url');

      const ext = path.extname(medium);

      // mp4とWebMは除外
      if (ext === '.gif' || ext === '.mp4' || ext === '.webm') return;

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

  normalizeRequestOptions() {
    const scale = ((term) => {
      switch (term) {
        case 'days':
          return 'day';
        case 'weeks':
          return 'week';
        case 'months':
          return 'month';
        default:
          return null;
      }
    })(this.term);

    const options = {
      url: service.danbooru.endpoint,
      query: {
        date: this.mDate.format('YYYY-MM-DD'),
        scale,
      },
    };

    return options;
  }
};
