const Downloader = require('./commons/Downloader');
const ImageDownloader = require('./commons/ImageDownloader');
const RandomStringGenerator = require('../utils/RandomStringGenerator');

module.exports = class YandereDownloader extends Downloader {
  getDownloadOptions() {
    return {};
  }

  async write(items) {
    const imageDownloader = new ImageDownloader({ directory: this.directory });
    const files = [];
    for (const item of items) {
      await super.wait();
      console.log(`Now :: ${item.images.medium}`);

      // download and write to local folder
      const filename = await imageDownloader.download({
        url: item.images.medium,
        filename: `${RandomStringGenerator.createHash(item.images.medium)}${item.ext}`,
        options: this.getDownloadOptions(),
      });

      // スクレインピングした情報とダウンロードした情報を合わせる
      const file = this.mixFileInfoAndContentInfo({ filename, info: item });

      files.push(file);
    }
    return files;
  }
};
