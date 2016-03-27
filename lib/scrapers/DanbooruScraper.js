'use strict';

const moment                = require('moment');
const path                  = require('path');
const randomstring          = require('randomstring');
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
    this.scraper = new Scraper(params.term);
    this.term = params.term; // scaleにすべき？
    this.date = moment().format('YYYY-MM-DD');
    this.illustList = [];
    this.directory = params.directory || `danbooru_${this.term}_${moment().format("YYYY_MM_DD")}`;
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
      console.log(opts);
      this.scrape(opts).then( result => resolve(result) ).catch( err => reject(err) );
    });
  }

  scrape(opts) {
    return new Promise((resolve, reject) => {
      this.scraper.scrape(opts)
      .then( result => {

        if (result.$('#c-explore-posts article').length === 0) {
          return resolve([]);
        }

        const _this= this;
        result.$('#c-explore-posts article').each( function(idx) {
          const title = result.$(this).data('tags');
          console.log(title);

          const sourceLinkRelative = result.$(this).find('a').attr('href');
          const sourceLinkAbsolute = `${DOMAIN}${sourceLinkRelative}`;
          console.log(sourceLinkAbsolute);

          const largeImgRelative = result.$(this).data('file-url');
          const largeImgAbsolute = `${DOMAIN}${largeImgRelative}`;
          const mediumImgRelative = result.$(this).data('large-file-url');
          const mediumImgAbsolute = `${DOMAIN}${mediumImgRelative}`;
          console.log(largeImgAbsolute);
          console.log(mediumImgAbsolute);

          const ext = path.extname(mediumImgAbsolute);

          const params = { title, sourceLinkAbsolute, largeImgAbsolute, mediumImgAbsolute, ext };

          _this.illustList.push(params);
        });
        resolve(this.illustList);
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
      DirectoryManager.generateSync(this.directory);

      var promises = [];
      this.illustList.forEach( (illust, illustIdx) => {
        const filename = RandomStringGenerator.createHash(illust.mediumImgAbsolute) + illust.ext;
        const filePathAbsolute = path.resolve(this.directory, filename);

        // プロパティの拡張
        illust.filename = filename;
        illust.filePathAbsolute = filePathAbsolute;
        this.illustList[illustIdx] = illust;

        // ダウンロードタスクの用意
        const opts = {
          url: illust.mediumImg || illust.mediumImgAbsolute,
          directory: this.directory,
          filename: filename,
        };
        promises.push(Delayer.delayPromise(illustIdx * 3 * 1000).then( _ => this.scraper.download(opts) ));
      });

      Promise.all(promises)
      .then( downloadResultList => resolve(this.illustList) )
      .catch( err => reject(err) );

    });
  }
};
