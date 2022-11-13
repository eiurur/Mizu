const url = require('url');
const Downloader = require('./commons/Downloader');
const ImageDownloader = require('./commons/ImageDownloader');
const RandomStringGenerator = require('../utils/RandomStringGenerator');

module.exports = class DanbooruDownloader extends Downloader {
  getDownloadOptions() {
    return {};
  }

  constructor({ directory, auth }) {
    super();
    this.directory = directory;
    this.auth = auth;
  }

  _appendQueryString(url_string, query_string_object) {
    const parsed_url = url.parse(url_string, true);
    parsed_url.query = Object.assign(parsed_url.query, query_string_object);
    return url.format(parsed_url);
  }

  _addAuthToUrl(url) {
    return this._appendQueryString(url, { login: this.auth.login, api_key: this.auth.api_key });
  }

  async write(items) {
    const imageDownloader = new ImageDownloader({ directory: this.directory });
    const files = [];
    for (const item of items) {
      try {
        await super.wait();
        if (this.debug) console.log(`Now :: ${item.images.medium}`);

        // download and write to local folder
        const filename = await imageDownloader.download({
          url: this._addAuthToUrl(item.images.medium),
          filename: `${RandomStringGenerator.createHash(item.images.medium)}${item.ext}`,
          options: this.getDownloadOptions(),
        });

        // スクレインピングした情報とダウンロードした情報を合わせる
        const file = this.mixFileInfoAndContentInfo({ filename, info: item });

        files.push(file);
      } catch (e) {
        console.log(e);
      }
    }
    return files;
  }
};
