const fsp = require('fs-extra');
const _download = require('download');
const RandomStringGenerator = require('../../utils/RandomStringGenerator');

module.exports = class ImageDownloader {
  constructor({ directory }) {
    this.directory = directory;
    return this;
  }
  /**
   * URLから画像を指定のフォルダにダウンロードする
   * @return {[type]}           [description]
   */
  async download({
    url, options, filename, hashed,
  } = {
      url: '',
      options: null,
      filename: new Date().getTime(),
      hashed: false,
    }) {
    try {
      const data = await _download(url, { options });
      const _filename = hashed
        ? `${RandomStringGenerator.createHashWithPayload(data)}.jpg`
        : `${filename}`;
      const filepath = `${this.directory}/${_filename}`;
      await fsp.writeFile(filepath, data);
      return _filename;
    } catch (e) {
      // status code === 404で画像のダウンロードに失敗したとき
      console.log(e);
      return null;
    }
  }
};
