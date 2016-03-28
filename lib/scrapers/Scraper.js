'use strict';

const client                = require('cheerio-httpcli');
const moment                = require('moment');
const path                  = require('path');
const Delayer               = require(path.join(__dirname, '..', 'utils', 'Delayer'));
const ImageDownloader       = require(path.join(__dirname, '..', 'utils', 'ImageDownloader'));
const DirectoryManager      = require(path.join(__dirname, '..', 'utils', 'DirectoryManager'));
const RandomStringGenerator = require(path.join(__dirname, '..', 'utils', 'RandomStringGenerator'));


module.exports = class Scraper {
  constructor(directory, requestOpts) {
    this._illustList = [];
    this._directory = directory;
  }

  set illustList(illustList) {
    this._illustList = illustList;
  }

  get illustList() {
    return this._illustList;
  }

  set directory(directory) {
    this._directory = directory;
  }

  /**
   * 画像を指定のフォルダにダウンロードする
   * @return {[type]} [description]
   */
  download(params) {
    return new Promise( resolve => ImageDownloader.download(params).then( filename => resolve(filename) ));
  }

  downloadIllusts() {
    return new Promise((resolve, reject) => {
      DirectoryManager.generateSync(this._directory);

      var promises = [];
      this._illustList.forEach( (illust, illustIdx) => {
        const filename = RandomStringGenerator.createHash(illust.url) + illust.ext;
        const filepath = path.resolve(this._directory, filename);

        // プロパティの拡張
        illust.filename = filename;
        illust.filepath = filepath;
        this._illustList[illustIdx] = illust;

        // 進捗情報が表示されないと不安になる
        console.log('Now :: ' + illust.url);

        // ダウンロードタスクの用意
        const opts = {
          url: illust.url,
          directory: this._directory,
          filename: filename,
          requestOpts: illust.requestOpts || {},  // 厳しい
        };
        promises.push(Delayer.delayPromise(illustIdx * 5 * 1000).then( _ => this.download(opts) ));
      });

      Promise.all(promises)
      .then( downloadResultList => resolve(this._illustList) )
      .catch( err => reject(err) );

    });
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
};
