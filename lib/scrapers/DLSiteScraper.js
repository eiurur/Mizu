const path = require('path');
const Scraper = require('./commons/Scraper');
const { service } = require('../configs/service');
const Illust = require('../entities/Illust');
const Logger = require('../utils/Logger');

// img.dlsite.jp/modpub/images2/work/books/BJ146000/BJ145626_img_sam.jpg
// img.dlsite.jp/modpub/images2/work/books/BJ146000/BJ145626_img_main.jpg
// img.dlsite.jp/modpub/images2/work/books/BJ146000/BJ145626_img_sam.jpg

module.exports = class DLSiteScraper extends Scraper {
  /**
   *
   * @param {String} term - 期間 days, weeks, months
   * @param {String} range - 販売日 all, new
   * @param {String} category - カテゴリ maniax, pro, books
   * @param {Array} workTypes - 作品の種類
   *  【同人】
   *      MNG (マンガ), MDC (デジタルコミック),
   *      ICG (イラスト集(CG集), IST (イラスト集), IN2 (イラスト(CG)+ノベル), INV (イラスト+ノベル)
   *      MOV, RPG, ADV, DNV, ACN, SLN, STG, QIZ, TBL, TYP, PZL, ETC,
   *      SOU (音声作品), MUS (音楽作品),
   *      NR2, NRE, ET3, ET4, TOL, AMT, IMT
   *  【美少女ゲーム】
   *      TODO
   *  【books】
   *      _雑誌/アンソロ, _単行本, _短編, _単話
   */
  constructor({ term, date }) {
    super();
    this.term = term;
    this.mDate = date; // 20180402 今のところ、使っていない
  }

  async scrape({
    range, category, workTypes, affiliateId,
  }) {
    const request = this.normalizeRequestOptions({
      range,
      category,
      workTypes,
    });
    const result = await super.fetch({
      url: request.url,
      query: request.query,
    });
    const contents = this.extract(result);

    // FIXME?: やっぱりアフィリエイトIDはコンストラクタで渡すべきでは？
    return affiliateId
      ? contents.map(content => this.attachAffiateId(content, affiliateId))
      : contents;
  }

  /**
   * 作品URLにアフィリエイトIDを付与する
   * @param {*} content - 作品情報
   * @param {*} affiliateId - アフィリエイトID
   *
   * 通常:           http://www.dlsite.com/books/work/=/product_id/BJ143124.html
   * affiateId 付き: http://www.dlsite.com/books/dlaf/=/link/work/aid/kawpaa/id/BJ143124.html
   *
   */
  attachAffiateId(content, affiliateId) {
    content.source = content.source.replace(
      'work/=/product_id',
      `dlaf/=/link/work/aid/${affiliateId}/id`,
    );
    return content;
  }

  extract(result) {
    const illusts = [];

    if (result.$('#ranking_table tr').length === 0) {
      return illusts;
    }

    result.$('#ranking_table tr').each(function (idx) {
      const workName = result
        .$(this)
        .find('.work_name a')
        .text();
      const makerName = result
        .$(this)
        .find('.maker_name a')
        .text();
      const title = `${workName} / ${makerName}`;

      const sourceRelative = result
        .$(this)
        .find('.work_name a')
        .attr('href');

      const source = result
        .$(this)
        .find('.work_name a')
        .attr('href');

      const mediumRelative = result
        .$(this)
        .find('.work_thumb img')
        .attr('src');
      const medium = `https:${mediumRelative}`;

      // FIXME: 6件目以降の('.work_img_main_popup img')が空なので。やむなく置換処理で対応
      // const largeRelative = result
      //   .$(this)
      //   .find('.work_img_main_popup img')
      //   .data('original');
      const large = medium.replace('_sam', '_main');

      const ext = path.extname(medium);

      // mp4とWebMは除外
      if (ext === '.gif' || ext === '.mp4' || ext === '.webm') return;

      // FIXME: 王冠マークもtrなので余計に抽出してしまい、各データがundefinedになる。 ので、除外
      // $('#ranking_table > tbody > tr') でフィルタリングできるはずだが、うまくいかない。
      if (!source || !mediumRelative) return;

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

  normalizeRequestOptions({
    range, category, workTypes, affiliateId,
  }) {
    const term = ((term) => {
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

    const url = `${service.dlsite.endpoint}/${category}/ranking/${term}`;

    // "http://www.dlsite.com/books/ranking/week?work_type[]=_雑誌/アンソロ&work_type[]=_単行本"
    const options = {
      url,
      query: {
        work_type: workTypes,
        release_date: range,
      },
    };

    return options;
  }
};
