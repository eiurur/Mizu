const client = require('cheerio-httpcli');
const moment = require('moment');
const path = require('path');

const Delayer = require(path.join(__dirname, '..', 'utils', 'Delayer'));
const ImageDownloader = require(path.join(__dirname, '..', 'utils', 'ImageDownloader'));
const DirectoryManager = require(path.join(__dirname, '..', 'utils', 'DirectoryManager'));
const RandomStringGenerator = require(path.join(__dirname, '..', 'utils', 'RandomStringGenerator'));

module.exports = class Downloader {
  constructor(directory, requestOpts) {
    this._directory = directory;
  }

  async download(list) {
    DirectoryManager.generateSync(this._directory);
    const takss = list.map(async (item, idx) => {
      await Delayer.delayPromise(idx * 3 * 1000);
      await this.download(item, opts);
    });
    const files = await Promise(tasks);
    return this.rejectDeficitItems(files);

    const downloadTasks = this._illustList
      .map((illust) => {
        console.log(`Now :: ${illust.url}`);
        const filename = RandomStringGenerator.createHash(illust.url) + illust.ext;
        return Object.assign({}, illust, {
          filename,
          filepath: path.resolve(this._directory, filename),
        });
      })
      .map((illust, idx) => {
        const opts = {
          url: illust.url,
          directory: this._directory,
          filename: illust.filename,
          requestOpts: illust.requestOpts || {}, // 厳しい
        };
        return Delayer.delayPromise(idx * 5 * 1000).then(_ => ImageDownloader.download(opts));
      });

    const result = await Promise.all(downloadTasks);
    return this.rejectIllustsFaildToDownload(result);
  }

  /**
   * 画像のダウンロードに失敗した場合、downloadResultListに画像ファイル名がnullでアサインされる。それを除外する。
   */
  rejectDeficitItems(items, key) {
    return items.filter(item => item[key] !== null);
  }

  /**
   * URLから画像を指定のフォルダにダウンロードする
   * @param  {[type]} directory [description]
   * @param  {[type]} filename  [description]
   * @return {[type]}           [description]
   */
  async download(params) {
    const data = await _download(params.url, { options: params.requestOpts });
    const filename = this.hash(data);
    const filepath = `${params.directory}/${filename}.jpg`;
    await fsp.writeFile(filepath, data);
    return filename;
  }
};
