'use strict';

const moment  = require('moment');
const axios   = require('axios');
const path    = require('path');
const Scraper = require('../scrapers/Scraper');

const DOMAIN        = 'https://chan.sankakucomplex.com';
const ENDPOINT      = `${DOMAIN}/ja/post/`;
const POST_SHOW_URL = `${DOMAIN}/ja/post/show/`;


module.exports = class SankakuComplexScrape {
  constructor(params) {
    this.term = params.term;
    this.date = moment().format('YYYY-MM-DD');
    this.directory = params.directory || `sankaku_complex_${this.term}_${moment(this.date).format("YYYY_MM_DD")}`;
    this.page = 1;

    this.scraper = new Scraper(this.directory);

    this.requestURL = '';
    this.requestOpts = {
      headers: {
        'User-Agent': 'Magic Browser',
        'referer': DOMAIN,
      }
    }
    this.instance = axios.create(this.requestOpts);
  }


  /**
   * [crawl description]
   * @return {[type]} [description]
   */
  crawl() {
    return new Promise((resolve, reject) => {
      // this.normalizePeriod();
      this.normalizeRequestURL();
      const opts = {
        url: this.requestURL,
        query: {
          day: moment(this.date).day(),
          month: moment(this.date).month(),
          year: moment(this.date).year(),
          page: this.page,
        }
      }
      console.log(opts);
      this.getJSON(opts)
      .then( illustList => this.addIllustList(illustList) )
      .then( result => resolve(result) )
      .catch( err => reject(err) );
    });
  }


  /**
   * [getJSON description]
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  getJSON(opts) {
    return new Promise((resolve, reject) => {
      this.instance.get(opts.url, {params: opts.query})
      .then( response => {
        if (response.status !== 200) return reject(response);
        return resolve(response.data);
      })
      .catch( response => {
        if (response instanceof Error) {
          console.log('Error', response.message);
        } else {
          console.log(response.data);
          console.log(response.status);
          console.log(response.headers);
          console.log(response.config);
        }
        return reject(response);
      })
    });
  }


  /**
   * TODO: staticメソッドとして外部化してもいいかも
   * [normalizeImageURL description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  normalizeImageURL(url) {
    const questionIdx = url.lastIndexOf('?');
    return (questionIdx === -1) ? url : url.slice(0, questionIdx);
  }


  /**
   * [addIllustList description]
   * @param {[type]} illustList [description]
   */
  addIllustList(illustList) {
    return new Promise((resolve,reject) => {
      if (illustList.length === 0) return reject(this.scraper.illustList);

      illustList.forEach( illust => {
        const title = POST_SHOW_URL + illust.id; // 手抜き
        const sourceLinkAbsolute = POST_SHOW_URL + illust.id;
        const largeImgURL = 'https:' + this.normalizeImageURL(illust.file_url);
        const mediumImgURL = 'https:' + this.normalizeImageURL(illust.sample_url);
        const url = mediumImgURL;
        const ext = path.extname(mediumImgURL);

        // mp4とWebMは除外
        if (ext === '.mp4' || ext === '.webm') return;

        const requestOpts = this.requestOpts;
        const params = { title, sourceLinkAbsolute, largeImgURL, mediumImgURL, url, ext, requestOpts };

        this.scraper.illustList.push(params);
      });
      resolve(this.scraper.illustList);
    });
  }


  /**
   *
   * QUESTION: 委譲のままでいいのかな？
   * @return {[type]} [description]
   */
  downloadIllusts() {
    return new Promise((resolve, reject) => {
      this.scraper.downloadIllusts()
      .then( downloadResultList => resolve(downloadResultList) )
      .catch( err => reject(err) );
    });
  }


  /**
   *
   * Facade: イラストをダウンロードしたあと、crawlしたイラストの情報をリセットする。
   * @return {[type]} [description]
   */
  download() {
    return new Promise((resolve, reject) => {
      this.downloadIllusts()
      .then( downloadResultList => {
        this.scraper.illustList = [];
        resolve(downloadResultList)
      })
      .catch( err => reject(err) );
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
        this.date = moment(this.date).add(_amount, 'days').format('YYYY-MM-DD');
        break;
      case 'week':
        this.date = moment(this.date).add(_amount, 'weeks').format('YYYY-MM-DD');
        break;
      case 'month':
        this.date = moment(this.date).add(_amount, 'months').format('YYYY-MM-DD');
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
        this.date = moment(this.date).subtract(_amount, 'days').format('YYYY-MM-DD');
        break;
      case 'week':
        this.date = moment(this.date).subtract(_amount, 'weeks').format('YYYY-MM-DD');
        break;
      case 'month':
        this.date = moment(this.date).subtract(_amount, 'months').format('YYYY-MM-DD');
        break;
      default:
        break;
    }
    return this;
  }


  /**
   * ページを進める
   * @return {[type]} [description]
   */
  turnPage(amount) {
    this.page += amount;
    if (this.page <= 0) this.page = 1;
    return this;
  }

  normalizeRequestURL() {
    switch (this.term) {
      case 'day':
        this.requestURL = `${ENDPOINT}popular_by_day.json`;
        break;
      case 'week':
        this.requestURL = `${ENDPOINT}popular_by_week.json`;
        break;
      case 'month':
        this.requestURL = `${ENDPOINT}popular_by_month.json`;
        break;
      default:
        this.requestURL = `${ENDPOINT}popular_by_day.json`;
        break;
    }
    return this;
  }
};
