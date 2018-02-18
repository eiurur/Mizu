const { service } = require('../configs/service');
const Downloader = require('./Downloader');
const ImageDownloader = require('./commons/ImageDownloader');
const RandomStringGenerator = require('../utils/RandomStringGenerator');

module.exports = class SankakuComplexDownloader extends Downloader {
  getDownloadOptions() {
    return {
      headers: {
        'User-Agent': 'Magic Browser',
        referer: service.sankaku_complex.domain,
      },
    };
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
