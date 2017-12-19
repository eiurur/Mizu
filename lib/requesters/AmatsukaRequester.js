'use strict';

const moment = require('moment');
const axios = require('axios');
const path = require('path');
const Scraper = require('../scrapers/Scraper');

const HOSTNAME = 'amatsuka.herokuapp.com';
const DOMAIN = 'https://amatsuka.herokuapp.com';
const ENDPOINT = `${DOMAIN}/api/ranking/`;

module.exports = class AmatsukaRequester {
  constructor(params) {
    this.date = moment(params.date).format('YYYY-MM-DD');
    this.term = params.term || 'day';
    this.sortType = params.sortType || 'total';
    this.limit = params.limit || 20;
    this.directory =
      params.directory ||
      `amatsuka_${this.term}_${moment(this.date).format('YYYY_MM_DD')}`;
    this.requestURL = '';
    this.requestOpts = {
      headers: {
        'User-Agent': 'Magic Browser',
        referer: DOMAIN,
      },
    };

    this.scraper = new Scraper(this.directory, this.requestOpts);
    this.instance = axios.create(this.requestOpts);
  }

  get hostname() {
    return HOSTNAME;
  }

  /**
   * [crawl description]
   * @return {[type]} [description]
   */
  crawl() {
    return new Promise((resolve, reject) => {
      // this.normalizePeriod();
      this._normalizeRequestURL();
      const opts = {
        url: this.requestURL,
        query: {
          date: moment(this.date).format('YYYY-MM-DD'),
          limit: this.limit,
        },
      };
      // console.log(opts);
      this._fetch(opts)
        .then(illustList => this._addIllustList(illustList))
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  /**
   *
   * Facade: イラストをダウンロードしたあと、crawlしたイラストの情報をリセットする。
   * @return {[type]} [description]
   */
  download() {
    return new Promise((resolve, reject) => {
      this.scraper
        .downloadIllusts()
        .then(downloadResultList => {
          this.scraper.illustList = [];
          resolve(downloadResultList);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * 次の期間へ(日、週、月)
   * @return {Function} [description]
   */
  next(amount, term) {
    const _amount = amount || 0;
    switch (term) {
      case 'day':
        this.date = moment(this.date)
          .add(_amount, 'days')
          .format('YYYY-MM-DD');
        break;
      case 'week':
        this.date = moment(this.date)
          .add(_amount, 'weeks')
          .format('YYYY-MM-DD');
        break;
      case 'month':
        this.date = moment(this.date)
          .add(_amount, 'months')
          .format('YYYY-MM-DD');
        break;
      default:
        break;
    }
    return this;
  }

  /**
   * 前の期間へ(日、週、月)
   * @return {[type]} [description]
   */
  prev(amount, term) {
    const _amount = amount || 0;
    switch (term) {
      case 'day':
        this.date = moment(this.date)
          .subtract(_amount, 'days')
          .format('YYYY-MM-DD');
        break;
      case 'week':
        this.date = moment(this.date)
          .subtract(_amount, 'weeks')
          .format('YYYY-MM-DD');
        break;
      case 'month':
        this.date = moment(this.date)
          .subtract(_amount, 'months')
          .format('YYYY-MM-DD');
        break;
      default:
        break;
    }
    return this;
  }

  // /**
  //  * ページを進める
  //  * @return {[type]} [description]
  //  */
  // turnPage(amount) {
  //   this.page += amount;
  //   if (this.page <= 0) this.page = 1;
  //   return this;
  // }

  /**
   * [_fetch description]
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  _fetch(opts) {
    return new Promise((resolve, reject) => {
      this.instance
        .get(opts.url, { params: opts.query })
        .then(response => {
          if (response.status !== 200) return reject(response);
          return resolve(response.data);
        })
        .catch(response => {
          if (response instanceof Error) {
            console.log('Error', response.message);
          } else {
            console.log(response.data);
            console.log(response.status);
            console.log(response.headers);
            console.log(response.config);
          }
          return reject(response);
        });
    });
  }

  // /**
  //  * TODO: staticメソッドとして外部化してもいいかも
  //  * [_normalizeImageURL description]
  //  * @param  {[type]} url [description]
  //  * @return {[type]}     [description]
  //  */
  // _normalizeImageURL(url) {
  //   const questionIdx = url.lastIndexOf("?");
  //   return questionIdx === -1 ? url : url.slice(0, questionIdx);
  // }

  /**
   * [_addIllustList description]
   * @param {[type]} illustList [description]
   */
  _addIllustList(illustList) {
    return new Promise((resolve, reject) => {
      console.log(illustList);
      if (illustList.length === 0) return reject(this.scraper.illustList);

      illustList.forEach(illust => {
        // TODO if 動画があれば then return
        const tweet = JSON.parse(illust.tweetStr);
        const title = `${illust.postedBy.name}@${
          illust.postedBy.screenName
        } / ${tweet.text}`; // 手抜き
        const sourceURL = tweet.extended_entities.media[0].display_url;
        const largeImgURL = `${
          tweet.extended_entities.media[0].media_url_https
        }:orig`;
        const mediumImgURL = `${
          tweet.extended_entities.media[0].media_url_https
        }:large`;
        const url = mediumImgURL;
        const ext = '.jpg'; // path.extname(mediumImgURL);

        // mp4とWebMは除外
        // if (ext === '.gif' || ext === '.mp4' || ext === '.webm') return;

        const params = {
          title,
          sourceURL,
          largeImgURL,
          mediumImgURL,
          url,
          ext,
        };

        this.scraper.illustList.push(params);
      });
      resolve(this.scraper.illustList);
    });
  }

  /**
   * [_normalizeRequestURL description]
   * @return {[type]} [description]
   */
  _normalizeRequestURL() {
    switch (this.term) {
      case 'day':
        this.requestURL = `${ENDPOINT}${this.sortType}/${this.term}`;
        break;
      case 'week':
        this.requestURL = `${ENDPOINT}${this.sortType}/${this.term}`;
        break;
      case 'month':
        this.requestURL = `${ENDPOINT}${this.sortType}/${this.term}`;
        break;
      default:
        this.requestURL = `${ENDPOINT}${this.sortType}/${this.term}`;
        break;
    }
    return this;
  }
};
