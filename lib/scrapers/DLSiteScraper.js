const path = require('path');
const Scraper = require('./commons/Scraper');
const { service } = require('../configs/service');
const Illust = require('../entities/Illust');

// img.dlsite.jp/modpub/images2/work/books/BJ146000/BJ145626_img_sam.jpg
// img.dlsite.jp/modpub/images2/work/books/BJ146000/BJ145626_img_main.jpg
// img.dlsite.jp/modpub/images2/work/books/BJ146000/BJ145626_img_sam.jpg

module.exports = class DLSiteScraper extends Scraper {
  /**
   *
   * @param {String} term - 期間 days, weeks, months, total
   * @param {String} range - 販売日 all, new
   * @param {String} type - 種別 maniax, books, pro,
   * @param {String} category - 作品の種類
   *  【maniax(同人)】
   *    comic, game, voice
   *  【books(成年コミック)】
   *      magazine(_雑誌/アンソロ)|comic(_単行本),|shot(_短編, _単話)
   *  【pro(美少女ゲーム)】
   *      TODO
   * @param {String} sub - 作品のサブカテゴリ
   *  【同人】
   *    comic
   *      MNG (マンガ), ICG (イラスト集(CG集),
   *    game
   *      MOV, RPG, ADV, DNV, ACN, SLN, STG, QIZ, TBL, TYP, PZL, ETC,
   *    voice
   *      SOU (音声作品), MUS (音楽), AMT(音素材)
   *  【books(成年コミック)】
   *    nothing
   *  【pro(美少女ゲーム)】
   *    TODO
   */
  constructor({ term, date, debug }) {
    super();
    this.term = term;
    this.mDate = date; // 20180402 今のところ、使っていない
    this.debug = debug;
  }

  async scrape({
    range,
    type,
    category,
    sub,
    affiliateId,
    skip = 0,
    limit = 20,
  }) {
    const request = this.normalizeRequestOptions({
      range,
      type,
      category,
      sub,
    });
    const result = await super.fetch({
      url: request.url,
      query: request.query,
    });
    const contents = this.extract(result);

    const takedContents = contents.slice(skip, skip + limit);

    // FIXME?: やっぱりアフィリエイトIDはコンストラクタで渡すべきでは？
    return affiliateId
      ? takedContents.map(content => this.attachAffiateId(content, affiliateId))
      : takedContents;
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

    result.$('#ranking_table tr').each(function(idx) {
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

      // const largeRelative = result
      //   .$(this)
      //   .find('.work_img_popover img')
      //   .attr('src');
      // const large = `https:${largeRelative}`;
      if (!source || !mediumRelative) return;

      const pattern = /_(\d+x\d+)/;
      const thumbnailUrl = medium.match(pattern);
      if (!thumbnailUrl || thumbnailUrl.length < 1) return;
      const large = medium
        .replace(thumbnailUrl[0], '')
        .replace('/resize/', '/modpub/');
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
      if (this.debug) console.log(illust);
      illusts.push(illust);
    });

    return illusts;
  }

  normalizeRequestOptions({ range, type, category, sub }) {
    const term = (term => {
      switch (term) {
        case 'days':
          return 'day';
        case 'weeks':
          return 'week';
        case 'months':
          return 'month';
        // TODO: year
        case 'total':
          return 'total';
        default:
          return null;
      }
    })(this.term);

    const url = `${service.dlsite.endpoint}/${type}/ranking/${term}`;

    // "http://www.dlsite.com/books/ranking/week?work_type[]=_雑誌/アンソロ&work_type[]=_単行本"
    const options = {
      url,
      query: {
        category,
        sub,
        date: range === 'new' ? '30d' : range,
      },
    };
    return options;
  }
};
