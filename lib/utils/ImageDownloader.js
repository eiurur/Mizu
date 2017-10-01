"use strict";

const fsp = require("fs-promise");
const path = require("path");
const crypto = require("crypto");
const _download = require("download");
const request = require("request");

module.exports = class ImageDownloader {
  /**
   * URLから画像を指定のフォルダにダウンロードする
   * @param  {[type]} directory [description]
   * @param  {[type]} filename  [description]
   * @return {[type]}           [description]
   */
  static async download(params, hashed = false) {
    const data = await _download(params.url, { options: params.requestOpts });
    const filename = hashed ? `${this.hash(data)}.jpg` : params.filename;
    const filepath = `${params.directory}/${filename}`;
    await fsp.writeFile(filepath, data);
    return filename;
  }

  static hash(payload) {
    return crypto
      .createHash("sha1")
      .update(payload, "utf8")
      .digest("hex");
  }
};
