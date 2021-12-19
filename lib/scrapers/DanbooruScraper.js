const path = require('path');
const sleep = require('sleep-promise');
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
    const illusts = await this.extract(result);
    return illusts;
  }

  async crawl({ title, source }) {
    const postResult = await this.fetch({
      url: source,
    });
    let large = '';
    postResult.$('.image-container').each(function () {
      large = postResult.$(this).data('file-url');
    });
    let medium = '';
    postResult.$('.image-container img').each(function () {
      medium = postResult.$(this).attr('src');
    });
    if (!medium) return null;

    const ext = path.extname(medium);

    // mp4とWebMは除外
    if (ext === '.gif' || ext === '.mp4' || ext === '.webm') return {};

    const illust = new Illust({
      title,
      ext,
      source,
      large,
      medium,
    });

    return illust;
  }

  async extract(result) {
    if (result.$('#c-explore-posts article').length === 0) {
      return [];
    }

    const posts = [];
    result.$('#c-explore-posts article').each(function (idx) {
      const title = result.$(this).data('tags');
      const sourceRelative = result.$(this).find('a').attr('href');
      const source = `${service.danbooru.domain}${sourceRelative}`;
      posts.push({ title, source });
    });

    const illusts = [];
    for (let post of posts) {
      const illust = await this.crawl(post);
      if (illust) illusts.push(illust);
    }
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
