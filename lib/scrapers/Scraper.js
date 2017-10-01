"use strict";

const client = require("cheerio-httpcli");
const moment = require("moment");
const path = require("path");
const Delayer = require(path.join(__dirname, "..", "utils", "Delayer"));
const ImageDownloader = require(path.join(
  __dirname,
  "..",
  "utils",
  "ImageDownloader"
));
const DirectoryManager = require(path.join(
  __dirname,
  "..",
  "utils",
  "DirectoryManager"
));
const RandomStringGenerator = require(path.join(
  __dirname,
  "..",
  "utils",
  "RandomStringGenerator"
));

module.exports = class Scraper {
  constructor(directory, requestOpts = {}) {
    this._illustList = [];
    this._directory = directory;
    this.requestOpts = requestOpts;
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

  async downloadIllusts() {
    DirectoryManager.generateSync(this._directory);

    this._illustList = await Promise.all(
      this._illustList.map((illust, illustIdx) => {
        console.log("Now :: " + illust.url);
        const filename =
          RandomStringGenerator.createHash(illust.url) + illust.ext;
        return Object.assign({}, illust, {
          filename: filename,
          filepath: path.resolve(this._directory, filename)
        });
      })
    );

    // console.log(this._illustList);

    const result = await Promise.all(
      this._illustList.map((illust, idx) => {
        const opts = {
          url: illust.url,
          directory: this._directory,
          filename: illust.filename,
          requestOpts: this.requestOpts // 厳しい
        };
        return Delayer.delayPromise(idx * 5 * 1000).then(_ =>
          ImageDownloader.download(opts)
        );
      })
    );

    // const result = await Promise.all(downloadTasks);
    return this.rejectIllustsFaildToDownload(result);
  }

  /**
   * 画像のダウンロードに失敗した場合、downloadResultListに画像ファイル名がnullでアサインされる。それを除外する。
   */
  rejectIllustsFaildToDownload(downloadedIllustList) {
    return this._illustList.filter(illust => {
      return illust && downloadedIllustList.includes(illust.filename);
    });
  }

  /**
   * [scrape description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  scrape(params) {
    return client.fetch(params.url, params.query);
  }
};
