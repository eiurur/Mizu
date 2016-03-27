'use strict';

const moment  = require('moment');
const path    = require('path');
const Scraper = require('./Scraper');

const DOMAIN   = 'https://danbooru.donmai.us';
const ENDPOINT = 'https://danbooru.donmai.us/explore/posts/popular';

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

module.exports = class DanbooruScraper {
  constructor(params) {
    this.term = params.term; // scaleにすべき？
    this.date = moment().format('YYYY-MM-DD');
    this.directory = params.directory || `danbooru_${this.term}_${moment(this.date).format("YYYY_MM_DD")}`;
    this.scraper = new Scraper(this.directory);
  }


  /**
   * [crawl description]
   * @return {[type]} [description]
   */
  crawl() {
    return new Promise((resolve, reject) => {
      const opts = {
        url: ENDPOINT,
        query: {
          date: this.date,
          scale: this.term,
        },
      };
      this.scrape(opts).then( result => resolve(result) ).catch( err => reject(err) );
    });
  }


  /**
   * [scrape description]
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  scrape(opts) {
    return new Promise((resolve, reject) => {
      var _illustList = this.scraper.illustList;
      this.scraper.scrape(opts)
      .then( result => {
        if (result.$('#c-explore-posts article').length === 0) {
          return resolve(this.scraper.illustList);
        }

        result.$('#c-explore-posts article').each( function(idx) {
          const title = result.$(this).data('tags');
          // console.log(title);

          const sourceLinkRelative = result.$(this).find('a').attr('href');
          const sourceLinkAbsolute = `${DOMAIN}${sourceLinkRelative}`;
          // console.log(sourceLinkAbsolute);

          const largeImgRelative = result.$(this).data('file-url');
          const largeImg = `${DOMAIN}${largeImgRelative}`;
          const mediumImgRelative = result.$(this).data('large-file-url');
          const mediumImg = `${DOMAIN}${mediumImgRelative}`;
          // console.log(largeImg);
          // console.log(mediumImg);

          const url = mediumImg;

          const ext = path.extname(mediumImg);

          const params = { title, sourceLinkAbsolute, largeImg, mediumImg, url, ext };

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
};
