'use strict';

const moment  = require('moment');
const path    = require('path');
const Scraper = require('./Scraper');

const DOMAIN   = 'https://chan.sankakucomplex.com';
const ENDPOINT = 'https://chan.sankakucomplex.com/ja/';

/**
 * MEMO
 *
 * https://chan.sankakucomplex.com/ja/?tags=date%3A2016-03-21..2016-03-28%20order%3Aquality

 * https://chan.sankakucomplex.com/ja/?next=1002.06%2B5200342&tags=date%3A2016-03-21..2016-03-27%20order%3Aquality&page=17

 * Day
 * https://chan.sankakucomplex.com/ja/?tags=date:2016-03-27 order:quality"
 *
 * Week
 * https://chan.sankakucomplex.com/ja/?tags=date:2016-03-21..2016-03-27 order:quality&page=17"
 *
 * Month
 * https://chan.sankakucomplex.com/ja/?tags=date:2016-03-01..2016-04-01 order:quality"
 *
 *
 * https://c.sankakucomplex.com/data/preview/b3/10/b3101d79f12eb514cd98534af5a965e7.jpg
 * https://cs.sankakucomplex.com/data/sample/3f/50/sample-3f50ab9e004b8558168a0096196968eb.jpg?5199229
 *
 * //c.sankakucomplex.com/data/preview/3f/50/3f50ab9e004b8558168a0096196968eb.jpg
 *
 * //cs.sankakucomplex.com/data/sample/3f/50/sample-3f50ab9e004b8558168a0096196968eb.jpg?5199229
 *
 * https://cs.sankakucomplex.com/data/36/d2/36d28faa6750011954c4ce7cac565c54.jpg?5207962
 *
 */

module.exports = class SankakuComplexScrape {
  constructor(params) {
    this.term = params.term;
    this.date = moment().format('YYYY-MM-DD');
    this.directory = params.directory || `sankaku_complex_${this.term}_${moment(this.date).format("YYYY_MM_DD")}`;
    this.scraper = new Scraper(this.directory);
  }


  /**
   * [crawl description]
   * @return {[type]} [description]
   */
  crawl() {
    return new Promise((resolve, reject) => {
      this.normalizePeriod();
      const opts = {
        url: ENDPOINT,
        query: {
          tags: `date:${this.period} order:quality`,
          page: this.page,
        },
      }
      this.scrape(opts).then( result => resolve(result) ).catch( err => reject(err) );
    });
  }


  /**
   * [scrape description]
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  scrape(opts) {
    return new Promise((resolve,reject) => {
      var _illustList = this.scraper.illustList;
      this.scraper.scrape(opts)
      .then( result => {

        result.$('.thumb').each( function(idx) {
          const title = result.$(this).find('.preview').attr('title');
          // console.log(title);

          const sourceLinkRelative = result.$(this).find('a').attr('href');
          const sourceLinkAbsolute = `${DOMAIN}${sourceLinkRelative}`;
          // console.log(sourceLinkAbsolute);

          const imgId = sourceLinkRelative.split('/').pop();

          const previewImg = 'https:' + result.$(this).find('.preview').attr('src');
          // console.log(previewImg);

          const largeImg = previewImg.replace('c.sankakucomplex.com', 'cs.sankakucomplex.com').replace('/preview', '');
          // console.log(largeImg)

          const filename = previewImg.split('/').pop();
          const sampleFilename = "sample-" + filename;
          const mediumImg = previewImg.replace('c.sankakucomplex.com', 'cs.sankakucomplex.com').replace('/preview', '/sample').replace(filename, sampleFilename);
          // console.log(mediumImg)

          // sankaku_complexでは画像のサイズが小さいとsample-imageが存在しない。
          // しかし、一覧ページ上では判断のしようがないのでlargeImgをダウンロードする。
          const url = mediumImg;

          const ext = path.extname(mediumImg);

          const requestOpts = {
            headers: {
              'User-Agent': 'Magic Browser',
              'referer': sourceLinkAbsolute,
            },
          };

          const params = { title, sourceLinkAbsolute, largeImg, mediumImg, url, ext, requestOpts };

          _illustList.push(params);
        });

        this.scraper.illustList = _illustList;
        resolve(this.scraper.illustList);
      })
      .catch( err => reject(err) );
    });
  }


  /**
   *
   * QUESTION: 委譲のままでいいのかな？
   * @return {[type]} [description]
   */
  downloadIllusts() {
    return new Promise((resolve, reject) => {
      this.scraper.downloadIllusts()
      .then( downloadResultList => resolve(downloadResultList) )
      .catch( err => reject(err) );
    });
  }


  /**
   * 次の期間へ(日、週、月)
   * @return {Function} [description]
   */
  next(amount, term) {
    const _amount = amount || 0;
    switch (term) {
      case 'day':
        this.date = moment(this.date).add(_amount, 'days').format('YYYY-MM-DD');
        break;
      case 'week':
        this.date = moment(this.date).add(_amount, 'weeks').format('YYYY-MM-DD');
        break;
      case 'month':
        this.date = moment(this.date).add(_amount, 'months').format('YYYY-MM-DD');
        break;
      default:
        break;
    }
    return this;
  }


  /**
   * 前の期間へ(日、週、月)
   * @return {[type]} [description]
   */
  prev(amount, term) {
    const _amount = amount || 0;
    switch (term) {
      case 'day':
        this.date = moment(this.date).subtract(_amount, 'days').format('YYYY-MM-DD');
        break;
      case 'week':
        this.date = moment(this.date).subtract(_amount, 'weeks').format('YYYY-MM-DD');
        break;
      case 'month':
        this.date = moment(this.date).subtract(_amount, 'months').format('YYYY-MM-DD');
        break;
      default:
        break;
    }
    return this;
  }


  /**
   * ページを進める
   * @return {[type]} [description]
   */
  turnPage() {

  }

  normalizePeriod() {
    switch (this.term) {
      case 'day':
        this.period = this.date;
        // this.date = moment(this.date).subtract(_amount, 'days').format('YYYY-MM-DD');
        break;
      case 'week':
        this.period = moment(this.date).subtract(1, 'weeks').format('YYYY-MM-DD') + ".." + this.date;
        // this.date = moment(this.date).subtract(_amount, 'weeks').format('YYYY-MM-DD');
        break;
      case 'month':
        this.period = moment(this.date).subtract(1, 'month').date(1).format('YYYY-MM-DD') + ".." + moment(this.date).date(1).format('YYYY-MM-DD');
        break;
      default:
        this.period = this.date;
        break;
    }
    console.log('this.period = ' + this.period);
    return this;
  }

};
