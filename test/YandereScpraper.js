const _ = require('lodash');
const assert = require('power-assert');
const Mizu = require('../');

describe('YandereScraper', () => {
  it('should return weekly illustList when pass {term: "day"}', (done) => {
    const opts = {
      name: 'yande_re',
      term: 'day',
    };
    const yandere = Mizu.createScpraper(opts);
    yandere.crawl()
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].title));
      done();
    });
  });

  it('should return weekly illustList when pass {term: "week"}', (done) => {
    const opts = {
      name: 'yande_re',
      term: 'week',
      directory: 'yandere_test_images_week',
    };
    const yandere = Mizu.createScpraper(opts);
    yandere.crawl()
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].title));

      return yandere.downloadIllusts();
    })
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].filename));
      done();
    });
  });

  // it('should return weekly illustList when pass {term: "month"}', (done) => {
  //   const opts = {
  //     name: 'yande_re',
  //     term: 'month',
  //   };
  //   const yandere = Mizu.createScpraper(opts);
  //   yandere.crawl()
  //   .then( illustList => {
  //     assert(_.isArray(illustList));
  //     assert(_.isString(illustList[1].title));
  //     done();
  //   });
  // });

  // it('should return weekly illustList when pass {term: "year"}', (done) => {
  //   const opts = {
  //     name: 'yande_re',
  //     term: 'year',
  //   };
  //   const yandere = Mizu.createScpraper(opts);
  //   yandere.crawl()
  //   .then( illustList => {
  //     assert(_.isArray(illustList));
  //     assert(_.isString(illustList[1].title));
  //     done();
  //   });
  // });
});
