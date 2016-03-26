'use strict';

const moment           = require('moment');
const path             = require('path');
const randomstring     = require('randomstring');
const Delayer          = require(path.join(__dirname, '..', 'utils', 'Delayer'));
const DirectoryManager = require(path.join(__dirname, '..', 'utils', 'DirectoryManager'));
const Scraper          = require('./Scraper');


module.exports = class YandereScraper {
    this.scraper = new Scraper(params.term);
  constructor(params) {
    // super(params.term);
    this.term = params.term;
    this.illustList = [];
    this.normalizeTerm();
    this.directory = params.directory || `yandere_${this.term}_${moment().format("YYYY_MM_DD")}`;
    this.domain = 'https://yande.re';
    this.endpoint = 'https://yande.re/post/popular_recent';
  }

  crawl() {
    return new Promise((resolve, reject) => {
      // const qs = querystring.stringify({period: this.term});
      // const url = `${this.endpoint}?${qs}`;
      const opts = {
        url: this.endpoint,
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
        console.log(result.$('title').text());
        const _this = this;
        result.$('#post-list-posts li').each( function(idx) {
          // console.log(idx);

          const title = result.$(this).find('.preview').attr('title');
          // console.log(title);

          const sourceLinkRelative = result.$(this).find('.thumb').attr('href');
          const sourceLinkAbsolute = `${_this.domain}${sourceLinkRelative}`;
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
        const filename = randomstring.generate() + illust.ext;
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
        promises.push(Delayer.delayPromise(illustIdx * 2000).then( _ => this.scraper.download(opts) ));
        // super.download(opts).then(_ => console.log(_)).catch( err => console.error(err));
        // promises.push(
        // Delayer.delayPromise(illustIdx * 2000)
        // .then( () => super.download(opts))
        // .catch(err => {
        //   console.error(err);
        //   return reject(err);
        // })
        // );
      });


      // テスト用
      // var opts = {
      //   url: this.illustList[0].mediumImg,
      //   directory: this.directory,
      //   filename: randomstring.generate() + this.illustList[0].ext,
      // };
      // Delayer.delayPromise(1 * 2000)
      // .then( _ => this.scraper.download(opts))
      // .then( _ => {
      //   console.log(_);
      //   return resolve(_
      // )})
      // .catch(err => {
      //   console.error(err);
      //   return reject(err);
      // })
      console.log('Download setup finished ===>');

      Promise.all(promises)
      .then( downloadResultList => {
        resolve(this.illustList);
      })
      .catch( err => {
        reject(err);
      });

      // なぜか動かない。
      // Promise.all(promises)
      // .then( downloadResultList => resolve(this.illustList) )
      // .catch( reject(err) );
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
