'use strict';

const moment                = require('moment');
const path                  = require('path');
const Delayer               = require(path.join(__dirname, '..', 'utils', 'Delayer'));
const DirectoryManager      = require(path.join(__dirname, '..', 'utils', 'DirectoryManager'));
const RandomStringGenerator = require(path.join(__dirname, '..', 'utils', 'RandomStringGenerator'));
const Scraper               = require('./Scraper');

const DOMAIN   = 'https://yande.re';
const ENDPOINT = 'https://yande.re/post/popular_recent';


module.exports = class YandereScraper {
  constructor(params) {
    this.scraper = new Scraper(params.term);
    // super(params.term);
    this.term = params.term;
    this.illustList = [];
    this.normalizeTerm();
    this.directory = params.directory || `yandere_${this.term}_${moment().format("YYYY_MM_DD")}`;
  }

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

  scrape(opts) {
    return new Promise((resolve, reject) => {
      this.scraper.scrape(opts)
      .then( result => {
        // console.log(result.$('title').text());

        // cheerioの中ではthisを参照できないので一時変数に代入。
        const _this = this;

        result.$('#post-list-posts li').each( function(idx) {
          // console.log(idx);

          const title = result.$(this).find('.preview').attr('title');
          // console.log(title);

          const sourceLinkRelative = result.$(this).find('.thumb').attr('href');
          const sourceLinkAbsolute = `${DOMAIN}${sourceLinkRelative}`;
          // console.log(sourceLinkAbsolute);

          const largeImg = result.$(this).find('.largeimg').attr('href');
          const mediumImg = largeImg.replace(/(image|jpeg)/, 'sample');
          // console.log(mediumImg);

          const ext = path.extname(mediumImg);

          const params = { title, sourceLinkAbsolute, largeImg, mediumImg, ext };
          _this.illustList.push(params);
        });
        resolve(this.illustList);
      })
      .catch( err => reject(err) );
    });
  }

  downloadIllusts() {
    return new Promise((resolve, reject) => {
      DirectoryManager.generateSync(this.directory);

      var promises = [];
      this.illustList.forEach( (illust, illustIdx) => {
        const filename = RandomStringGenerator.createHash(illust.mediumImg) + illust.ext;
        const filePathAbsolute = path.resolve(this.directory, filename);

        // プロパティの拡張
        illust.filename = filename;
        illust.filePathAbsolute = filePathAbsolute;
        this.illustList[illustIdx] = illust;

        // ダウンロードタスクの用意
        const opts = {
          url: illust.mediumImg,
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
  }
};
