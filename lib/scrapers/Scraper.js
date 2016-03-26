'use strict';

const client = require('cheerio-httpcli');
const path = require('path');
const ImageDownloader = require(path.join(__dirname, '..', 'utils', 'ImageDownloader'));

module.exports = class Scraper {
  constructor(term) {
    this.term = term;
    this.illustList = [];
  }

  /**
   * 次の期間へ(日、週、月)
   * @return {Function} [description]
   */
  next() {}

  /**
   * 前の期間へ(日、週、月)
   * @return {[type]} [description]
   */
  prev() {}

  /**
   * 画像を指定のフォルダにダウンロードする
   * @return {[type]} [description]
   */
  download(params) {
    return new Promise( resolve => ImageDownloader.download(params).then( filename => resolve(filename) ));
  }

  /**
   * [scrape description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  scrape(params) {
    return new Promise((resolve, reject) => {
      client.fetch(params.url, params.query)
      .then( result => {
        if (result.error) return reject(err);
        return resolve(result);
      });
    });
  }

  /**
   * スクレイピング済みの画像情報を返却する
   * @return {[type]} [description]
   */
  listup() {}

};
