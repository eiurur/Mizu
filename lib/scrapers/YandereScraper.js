'use strict';

const moment  = require('moment');
const path    = require('path');
const Scraper = require('./Scraper');

const DOMAIN   = 'https://yande.re';
const ENDPOINT = `${DOMAIN}/post/popular_recent`;


module.exports = class YandereScraper {
  constructor(params) {
    // super(params.term);
    this.term = params.term;
    this.normalizeTerm();
    this.directory = params.directory || `yandere_${this.term}_${moment().format("YYYY_MM_DD")}`;
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
          period: this.term,
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

        if (result.$('#post-list-posts li').length === 0) {
          return resolve(this.scraper.illustList);
        }

        result.$('#post-list-posts li').each( function(idx) {
          // console.log(idx);

          const title = result.$(this).find('.preview').attr('title');
          // console.log(title);

          const sourceLinkRelative = result.$(this).find('.thumb').attr('href');
          const sourceLinkAbsolute = `${DOMAIN}${sourceLinkRelative}`;
          // console.log(sourceLinkAbsolute);

          const largeImg = result.$(this).find('.directlink').attr('href');
          // console.log(largeImg);
          const mediumImg = largeImg.replace(/(image|jpeg)/, 'sample');
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
   *
   * Facade: イラストをダウンロードしたあと、crawlしたイラストの情報をリセットする。
   * @return {[type]} [description]
   */
  download() {
    return new Promise((resolve, reject) => {
      this.downloadIllusts()
      .then( downloadResultList => {
        this.scraper.illustList = [];
        resolve(downloadResultList)
      })
      .catch( err => reject(err) );
    });
  }


  /**
   * [normalizeTerm description]
   * @return {[type]} [description]
   */
  normalizeTerm() {
    switch (this.term) {
      case 'day':
        this.term = '1d';
        break;
      case 'week':
        this.term = '1w';
        break;
      case 'month':
        this.term = '1m';
        break;
      case 'year':
        this.term = '1y';
        break;
      default:
        this.term = '1w';
        break;
    }
    return this;
  }
};
