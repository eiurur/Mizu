const path = require('path');
const Scraper = require('./Scraper');
const { service } = require('../configs/service');
const Illust = require('../entities/Illust');
const Logger = require('../utils/Logger');

/**
 * MEMO
 *
 * day
 * https://danbooru.donmai.us/explore/posts/popular?date=2016-03-26&scale=day
 *
 * week
 * https://danbooru.donmai.us/explore/posts/popular?date=2016-03-26&scale=week
 *
 * month
 * https://danbooru.donmai.us/explore/posts/popular?date=2016-03-26&scale=month
 */
module.exports = class DanbooruScraper extends Scraper {
  constructor({ term, date }) {
    super();
    this.term = term;
    this.mDate = date;
  }

  async scrape() {
    const request = this.normalizeRequestOptions();
    const result = await super.fetch({
      url: request.url,
      query: request.query,
    });
    return this.extract(result);
  }

  extract(result) {
    const illusts = [];

    if (result.$('#c-explore-posts article').length === 0) {
      return illusts;
    }

    result.$('#c-explore-posts article').each(function (idx) {
      const title = result.$(this).data('tags');

      const sourceRelative = result
        .$(this)
        .find('a')
        .attr('href');

      const source = `${service.danbooru.domain}${sourceRelative}`;
      const largeRelative = result.$(this).data('file-url');
      const large = `${service.danbooru.domain}${largeRelative}`;
      const mediumRelative = result.$(this).data('large-file-url');
      const medium = `${service.danbooru.domain}${mediumRelative}`;

      const ext = path.extname(medium);

      // mp4とWebMは除外
      if (ext === '.gif' || ext === '.mp4' || ext === '.webm') return;

      const illust = new Illust({
        title,
        ext,
        source,
        large,
        medium,
      });

      illusts.push(illust);
    });

    return illusts;
  }

  normalizeRequestOptions() {
    const scale = ((term) => {
      switch (term) {
        case 'days':
          return 'day';
        case 'weeks':
          return 'week';
        case 'months':
          return 'month';
        default:
          return null;
      }
    })(this.term);

    const options = {
      url: service.danbooru.endpoint,
      query: {
        date: this.mDate.format('YYYY-MM-DD'),
        scale,
      },
    };

    return options;
  }

  // /**
  //  * [scrape description]
  //  * @param  {[type]} opts [description]
  //  * @return {[type]}      [description]
  //  */
  // scrape(opts) {
  //   return new Promise((resolve, reject) => {
  //     const _illustList = this.scraper.illustList;
  //     this.scraper
  //       .scrape(opts)
  //       .then((result) => {
  //         if (result.$('#c-explore-posts article').length === 0) {
  //           return resolve(this.scraper.illustList);
  //         }

  //         result.$('#c-explore-posts article').each(function (idx) {
  //           const title = result.$(this).data('tags');

  //           const sourceRelative = result
  //             .$(this)
  //             .find('a')
  //             .attr('href');

  //           const source = `${service.danbooru.domain}${sourceRelative}`;
  //           const largeImgURLRelative = result.$(this).data('file-url');
  //           const largeImgURL = `${service.danbooru.domain}${largeImgURLRelative}`;
  //           const mediumImgURLRelative = result.$(this).data('large-file-url');
  //           const mediumImgURL = `${service.danbooru.domain}${mediumImgURLRelative}`;

  //           const url = mediumImgURL;

  //           const ext = path.extname(mediumImgURL);

  //           // mp4とWebMは除外
  //           if (ext === '.gif' || ext === '.mp4' || ext === '.webm') return;

  //           const params = {
  //             title,
  //             source,
  //             largeImgURL,
  //             mediumImgURL,
  //             url,
  //             ext,
  //           };

  //           _illustList.push(params);
  //         });

  //         this.scraper.illustList = _illustList;
  //         resolve(this.scraper.illustList);
  //       })
  //       .catch(err => reject(err));
  //   });
  // }

  // /**
  //  *
  //  * Facade: イラストをダウンロードしたあと、crawlしたイラストの情報をリセットする。
  //  * @return {[type]} [description]
  //  */
  // download() {
  //   return new Promise((resolve, reject) => {
  //     this.scraper
  //       .downloadIllusts()
  //       .then((downloadResultList) => {
  //         this.scraper.illustList = [];
  //         resolve(downloadResultList);
  //       })
  //       .catch(err => reject(err));
  //   });
  // }

  // /**
  //  * 次の期間へ(日、週、月)
  //  * @return {Function} [description]
  //  */
  // next(amount, term) {
  //   const _amount = amount || 0;
  //   switch (term) {
  //     case 'day':
  //       this.date = moment(this.date)
  //         .add(_amount, 'days')
  //         .format('YYYY-MM-DD');
  //       break;
  //     case 'week':
  //       this.date = moment(this.date)
  //         .add(_amount, 'weeks')
  //         .format('YYYY-MM-DD');
  //       break;
  //     case 'month':
  //       this.date = moment(this.date)
  //         .add(_amount, 'months')
  //         .format('YYYY-MM-DD');
  //       break;
  //     default:
  //       break;
  //   }
  //   return this;
  // }

  // /**
  //  * 前の期間へ(日、週、月)
  //  * @return {[type]} [description]
  //  */
  // prev(amount, term) {
  //   const _amount = amount || 0;
  //   switch (term) {
  //     case 'day':
  //       this.date = moment(this.date)
  //         .subtract(_amount, 'days')
  //         .format('YYYY-MM-DD');
  //       break;
  //     case 'week':
  //       this.date = moment(this.date)
  //         .subtract(_amount, 'weeks')
  //         .format('YYYY-MM-DD');
  //       break;
  //     case 'month':
  //       this.date = moment(this.date)
  //         .subtract(_amount, 'months')
  //         .format('YYYY-MM-DD');
  //       break;
  //     default:
  //       break;
  //   }
  //   return this;
  // }
};
