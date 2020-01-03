const path = require('path');
const axios = require('axios');
const Scraper = require('./commons/Scraper');
const { service } = require('../configs/service');
const { DOWNLOADING_NUMBER_LIMIT } = require('../configs/constants');
const Illust = require('../entities/Illust');
const Logger = require('../utils/Logger');

module.exports = class AmatsukaRequester extends Scraper {
  // CAUTION: dateはmomentのオブジェクト
  // TODO: term, mDateをクラス化
  constructor({ term, date }) {
    super();
    this.term = term;
    this.mDate = date;
  }

  async fetch({ url, query }) {
    return await axios.get(url, query);
  }

  async scrape({ options }) {
    const request = this.normalizeRequestOptions({ sort: options.sort });
    const result = await this.fetch({
      url: request.url,
      query: request.query,
    });
    console.log(result.data);
    return this.extract(result.data);
  }

  extract(result) {
    const illusts = [];

    if (result.length === 0) {
      return illusts;
    }

    result.forEach(post => {
      const tweet = JSON.parse(post.tweetStr);
      tweet.extended_entities.media.forEach(media => {
        // 動画は保存対象外
        if (media.type === 'video') return;

        const title = `${post.postedBy.name}@${post.postedBy.screenName} / ${tweet.text}`; // 手抜き
        const source = media.display_url;
        const large = `${media.media_url_https}:orig`;
        const medium = `${media.media_url_https}:large`;
        const ext = path.extname(this.normalizeUrl(medium, ':'));

        // mp4とWebMは除外
        if (ext === '.mp4' || ext === '.webm') return;

        const illust = new Illust({
          title,
          ext,
          source,
          large,
          medium,
        });

        illusts.push(illust);
      });
    });

    return illusts;
  }

  /**
   * TODO: staticメソッドとして外部化してもいいかも
   * [_normalizeImageURL description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  normalizeUrl(url, separator = '?') {
    const questionIdx = url.lastIndexOf(separator);
    return questionIdx === -1 ? url : url.slice(0, questionIdx);
  }

  /**
   * [normalizeRequestOptions description]
   * @return {[type]} [description]
   */
  // normalizeRequestOptions() {
  normalizeRequestOptions({ sort }) {
    const url = `${service.amatsuka.endpoint}/${sort}/${this.term}`;
    const query = {
      date: this.mDate.format('YYYY-MM-DD'),
      limit: DOWNLOADING_NUMBER_LIMIT,
    };

    const options = {
      url,
      query,
    };

    return options;
  }
};
