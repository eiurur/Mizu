'use strict';

const _ = require('lodash');
const assert = require('power-assert');
const Mizu = require('../');

const testDownloading = (opts, done) => {
  const crawler = Mizu.createCrawler(opts);
  crawler.crawl()
    .then(illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].title));
      return crawler.download();
    })
    .then(illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].filename) && !_.isEmpty(illustList[1].filename));
      done();
    })
    .catch(err => {
      console.error(err);
      done();
    });
}

describe('YandereScraper', () => {
  it('should return hostname(yande.re) when get hostname', () => {
    const opts = {
      name: 'yande_re',
      term: 'day',
    };
    const yande_re = Mizu.createCrawler(opts);
    assert(yande_re.hostname === 'yande.re');
  });


  it('should return daoly illustList when pass {term: "day"}', (done) => {
    const opts = {
      name: 'yande_re',
      term: 'day',
    };
    testDownloading(opts, done);
  });

  it('should return weekly illustList when pass {term: "week"}', (done) => {
    const opts = {
      name: 'yande_re',
      term: 'week',
      directory: 'yandere_test_images_week',
    };
    testDownloading(opts, done);
  });

  it('should return monthly illustList when pass {term: "month"}', (done) => {
    const opts = {
      name: 'yande_re',
      term: 'month',
    };
    testDownloading(opts, done);
  });

  it('should return yearly illustList when pass {term: "year"}', (done) => {
    const opts = {
      name: 'yande_re',
      term: 'year',
    };
    testDownloading(opts, done);
  });
});
