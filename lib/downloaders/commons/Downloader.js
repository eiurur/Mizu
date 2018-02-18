const path = require('path');

const Delayer = require(path.join(__dirname, '..', '..', 'utils', 'Delayer'));
const DirectoryManager = require(path.join(__dirname, '..', '..', 'utils', 'DirectoryManager'));

module.exports = class Downloader {
  constructor({ directory }) {
    this.directory = directory;
    return this;
  }

  preprocess() {
    DirectoryManager.generateSync(this.directory);
  }

  getDownloadOptions() {
    return {};
  }

  async write(items) {
    throw new Error('Not implemented write() in Downloader');
  }

  // 1～2秒待つ
  async wait(ms = 1000 + 1000 * Math.random()) {
    await Delayer.delayPromise(ms);
  }

  async download(items) {
    this.preprocess();
    const files = await this.write(items);
    return this.rejectIllustsFaildToDownload(files);
  }

  mixFileInfoAndContentInfo({ filename, info }) {
    return Object.assign({}, info, {
      filename,
      filepath: path.resolve(this.directory, filename),
    });
  }

  /**
   * 画像のダウンロードに失敗した場合、downloadResultListに画像ファイル名がnullでアサインされる。それを除外する。
   */
  rejectIllustsFaildToDownload(files) {
    const filenames = files.map(file => file.filename);
    return files.filter(file => file && filenames.includes(file.filename));
  }
};
