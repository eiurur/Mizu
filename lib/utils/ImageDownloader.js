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
    return new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(`${params.directory}/${params.filename}`);
      const r = request(params.url, params.requestOpts);
      r.on('response', (res) => {
        if (res.statusCode !== 200) return reject(null);
         r.pipe(ws);
      });
      ws.on( 'finish', _ => {
        console.log('Fin Download :: ' + params.url);
        resolve(params.filename);
      });
      ws.on( 'error', err => {
        ws.end();
        return reject(err);
      });
    });
  }
};
