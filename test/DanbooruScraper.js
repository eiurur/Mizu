'use strict';

const _      = require('lodash');
const assert = require('power-assert');
const Mizu   = require('../');

describe('DanbooruScraper', () => {
  it('should return daily illustList when pass {term: "day"}', (done) => {
    const opts = {
      name: 'danbooru',
      term: 'day',
    };
    const danbooru = Mizu.createScpraper(opts);
    danbooru.crawl()
    .then( illustList => {
      assert(_.isArray(illustList));
      // assert(_.isString(illustList[1].title));
      done();
    });
  });

  it('should return weekly illustList when pass {term: "week"}', (done) => {
    const opts = {
      name: 'danbooru',
      term: 'week',
      directory: 'danbooru_test_images_week',
    };
    const danbooru = Mizu.createScpraper(opts);
    danbooru.crawl()
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].title));

      return danbooru.downloadIllusts();
    })
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].filename));
      done();
    });
  });

  it('should return weekly illustList when pass {term: "month"}', (done) => {
    const opts = {
      name: 'danbooru',
      term: 'month',
    };
    const danbooru = Mizu.createScpraper(opts);
    danbooru.crawl()
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].title));
      done();
    });
  });

  // it('should return weekly illustList when pass {term: "year"}', (done) => {
  //   const opts = {
  //     name: 'danbooru',
  //     term: 'year',
  //   };
  //   const danbooru = Mizu.createScpraper(opts);
  //   danbooru.crawl()
  //   .then( illustList => {
  //     assert(_.isArray(illustList));
  //     assert(_.isString(illustList[1].title));
  //     done();
  //   });
  // });
});
