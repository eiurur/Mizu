'use strict';

const fs      = require('fs');
const path    = require('path');
const request = require('request');

module.exports = class ImageDownloader {

  /**
   * URLから画像を指定のフォルダにダウンロードする
   * @param  {[type]} directory [description]
   * @param  {[type]} filename  [description]
   * @return {[type]}           [description]
   */
  static download(params) {
    console.log(params);
    return new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(`${params.directory}/${params.filename}`);
      request(params.url).pipe(ws);
      ws.on( 'finish', _ => resolve(params.filename) );
      ws.on( 'error', err => {
        ws.end();
        return reject(err);
      });
    });
  }
};
