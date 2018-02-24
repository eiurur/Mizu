const path = require('path');
const axios = require('axios');
const Scraper = require('./commons/Scraper');
const { service } = require('../configs/service');
const Illust = require('../entities/Illust');
const Logger = require('../utils/Logger');

module.exports = class SankakuComplexScraper extends Scraper {
  // CAUTION: dateはmomentのオブジェクト
  // TODO: term, mDateをクラス化
  constructor({ term, date }) {
    super();
    this.term = term;
    this.mDate = date;
  }

  async fetch({ url, query }) {
    console.log(url, query);
    return await axios.get(url, query);
  }

  async scrape() {
    const request = this.normalizeRequestOptions();
    const result = await this.fetch({
      url: request.url,
      query: request.query,
    });
    return this.extract(result.data);
  }

  extract(result) {
    const illusts = [];

    if (result.length === 0) {
      return illusts;
    }

    result.forEach((post) => {
      const title = service.sankaku_complex.post + post.id; // 手抜き
      const source = service.sankaku_complex.post + post.id;
      const large = `https:${this.normalizeUrl(post.file_url)}`;
      const medium = `https:${this.normalizeUrl(post.sample_url)}`;
      const ext = path.extname(medium);

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
  normalizeRequestOptions() {
    //  day=16&month=2&year=2018
    const url = service.sankaku_complex.endpoint[this.term];
    const [year, month, day] = this.mDate.format('YYYY-MM-DD').split('-');
    const query = {
      year,
      month,
      day,
      // page, -> TODO: pageっているの？
    };

    const options = {
      url,
      query,
    };

    return options;
  }
};
