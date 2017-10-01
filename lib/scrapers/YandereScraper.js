"use strict";

const moment = require("moment");
const path = require("path");
const Scraper = require("./Scraper");

const HOSTNAME = "yande.re";
const DOMAIN = "https://yande.re";
const ENDPOINT = `${DOMAIN}/post/popular_recent`;

module.exports = class YandereScraper {
  constructor(params) {
    // super(params.term);
    this.term = params.term;
    this._normalizeTerm();
    this.directory =
      params.directory ||
      `yandere_${this.term}_${moment().format("YYYY_MM_DD")}`;
    this.scraper = new Scraper(this.directory);
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
      const opts = {
        url: ENDPOINT,
        query: {
          period: this.term
        }
      };
      this.scrape(opts)
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  /**
   * [scrape description]
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  scrape(opts) {
    return new Promise((resolve, reject) => {
      var _illustList = this.scraper.illustList;
      this.scraper
        .scrape(opts)
        .then(result => {
          if (result.$("#post-list-posts li").length === 0) {
            return resolve(this.scraper.illustList);
          }

          result.$("#post-list-posts li").each(function(idx) {
            // console.log(idx);

            const title = result
              .$(this)
              .find(".preview")
              .attr("title");
            // console.log(title);d

            const sourceURLRelative = result
              .$(this)
              .find(".thumb")
              .attr("href");
            const sourceURL = `${DOMAIN}${sourceURLRelative}`;
            // console.log(sourceURL);

            const largeImgURL = result
              .$(this)
              .find(".directlink")
              .attr("href");
            // console.log(largeImgURL);
            const mediumImgURL = largeImgURL.replace(/(image|jpeg)/, "sample");
            // console.log(mediumImgURL);

            const url = mediumImgURL;

            const ext = path.extname(mediumImgURL);

            // mp4とWebMは除外
            if (ext === ".mp4" || ext === ".webm") return;

            const params = {
              title,
              sourceURL,
              largeImgURL,
              mediumImgURL,
              url,
              ext
            };
            _illustList.push(params);
          });

          this.scraper.illustList = _illustList;
          resolve(this.scraper.illustList);
        })
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
   * HACK: インターフェースの共通化のために定義。でもこれってどうなの？
   *
   * @return {Function} [description]
   */
  next() {
    return this;
  }

  /**
   * 前の期間へ(日、週、月)
   * HACK: インターフェースの共通化のために定義。でもこれってどうなの？
   *　
   * @return {[type]} [description]
   */
  prev() {
    return this;
  }

  /**
   * [_normalizeTerm description]
   * @return {[type]} [description]
   */
  _normalizeTerm() {
    switch (this.term) {
      case "day":
        this.term = "1d";
        break;
      case "week":
        this.term = "1w";
        break;
      case "month":
        this.term = "1m";
        break;
      case "year":
        this.term = "1y";
        break;
      default:
        this.term = "1w";
        break;
    }
    return this;
  }
};
