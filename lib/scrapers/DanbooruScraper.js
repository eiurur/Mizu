'use strict';

const moment                = require('moment');
const path                  = require('path');
const Delayer               = require(path.join(__dirname, '..', 'utils', 'Delayer'));
const DirectoryManager      = require(path.join(__dirname, '..', 'utils', 'DirectoryManager'));
const RandomStringGenerator = require(path.join(__dirname, '..', 'utils', 'RandomStringGenerator'));
const Scraper               = require('./Scraper');

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
    // this.illustList = [];
    this.directory = params.directory || `danbooru_${this.term}_${moment().format("YYYY_MM_DD")}`;
    this.scraper = new Scraper(this.directory);
  }

  crawl() {
    return new Promise((resolve, reject) => {
      const opts = {
        url: ENDPOINT,
        query: {
          date: this.date,
          scale: this.term,
        },
      };
      // console.log(opts);
      this.scrape(opts).then( result => resolve(result) ).catch( err => reject(err) );
    });
  }

  scrape(opts) {
    return new Promise((resolve, reject) => {
      var _illustList = this.scraper.illustList;
      this.scraper.scrape(opts)
      .then( result => {

        if (result.$('#c-explore-posts article').length === 0) {
          return resolve([]);
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

          const ext = path.extname(mediumImg);

          const params = { title, sourceLinkAbsolute, largeImg, mediumImg, ext };

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
   * TODO: コピペした。
   * @return {[type]} [description]
   */
  downloadIllusts() {
    return new Promise((resolve, reject) => {
      this.scraper.downloadIllusts()
      .then( downloadResultList => resolve(downloadResultList) )
      .catch( err => reject(err) );
    });
  }
};
