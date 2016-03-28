'use strict';

const _      = require('lodash');
const moment = require('moment');
const assert = require('power-assert');
const Mizu   = require('../');

describe('SankakuComplexRequester', () => {
  it('should return hostname(chan.sankakucomplex.com) when get hostname', () => {
    const opts = {
      name: 'sankaku_complex',
      term: 'day',
    };
    const sankaku_complex = Mizu.createCrawler(opts);
    assert(sankaku_complex.hostname === 'chan.sankakucomplex.com');
  });

  it('should add date', () => {
    const opts = {
      name: 'sankaku_complex',
      term: 'day',
    };
    const sankaku_complex = Mizu.createCrawler(opts);
    assert(sankaku_complex.next(1, 'day').date === moment().add(1, 'days').format('YYYY-MM-DD'));
    assert(sankaku_complex.next(1, 'week').date === moment().add(1, 'days').add(1, 'weeks').format('YYYY-MM-DD'));
    assert(sankaku_complex.next(1, 'month').date === moment().add(1, 'days').add(1, 'weeks').add(1, 'months').format('YYYY-MM-DD'));
  });

  it('should sbstract date', () => {
    const opts = {
      name: 'sankaku_complex',
      term: 'day',
    };
    const sankaku_complex = Mizu.createCrawler(opts);
    assert(sankaku_complex.prev(2, 'day').date === moment().subtract(2, 'days').format('YYYY-MM-DD'));
    assert(sankaku_complex.prev(2, 'week').date === moment().subtract(2, 'days').subtract(2, 'weeks').format('YYYY-MM-DD'));
    assert(sankaku_complex.prev(2, 'month').date === moment().subtract(2, 'days').subtract(2, 'weeks').subtract(2, 'months').format('YYYY-MM-DD'));
  });

  it('should turnPage', () => {
    const opts = {
      name: 'sankaku_complex',
      term: 'day',
    };
    const sankaku_complex = Mizu.createCrawler(opts);
    assert(sankaku_complex.page === 1);
    assert(sankaku_complex.turnPage(1).page === 2);
    assert(sankaku_complex.turnPage(2).page === 4);
    assert(sankaku_complex.turnPage(-1).page === 3);
    assert(sankaku_complex.turnPage(-100).page === 1);
  });

  it('should return daily illustList when pass {term: "day"}', (done) => {
    const opts = {
      name: 'sankaku_complex',
      term: 'day',
    };
    const sankaku_complex = Mizu.createCrawler(opts);
    sankaku_complex.prev(1, 'day').crawl()
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].title));
      done();
    })
    .catch( err => {
      console.error(err);
      done();
    });
  });

  it('should return weekly illustList when pass {term: "week"}', (done) => {
    const opts = {
      name: 'sankaku_complex',
      term: 'week',
      directory: 'sankaku_complex_test_images_week',
    };
    const sankaku_complex = Mizu.createCrawler(opts);
    sankaku_complex.prev(1, 'week').crawl()
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].title));
      return sankaku_complex.download();
    })
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].filename) && !_.isEmpty(illustList[1].filename));
      done();
    })
    .catch( err => {
      console.error(err);
      done();
    });
  });

  it('should return monthly illustList when pass {term: "month"}', (done) => {
    const opts = {
      name: 'sankaku_complex',
      term: 'month',
      directory: 'sankaku_complex_test_images_month',
    };
    const sankaku_complex = Mizu.createCrawler(opts);
    sankaku_complex.prev(1, 'month').crawl()
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].title));

      return sankaku_complex.download();
    })
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].filename) && !_.isEmpty(illustList[1].filename));
      done();
    })
    .catch( err => {
      console.error(err);
      done();
    });
  });

  it('should return monthly illustList of the 2nd page when pass {term: "month"}', (done) => {
    const opts = {
      name: 'sankaku_complex',
      term: 'month',
      directory: 'sankaku_complex_test_images_month',
    };
    const sankaku_complex = Mizu.createCrawler(opts);
    sankaku_complex.prev(1, 'month').turnPage(1).crawl()
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].title));

      return sankaku_complex.download();
    })
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].filename) && !_.isEmpty(illustList[1].filename));
      done();
    })
    .catch( err => {
      console.error(err);
      done();
    });
  });

  it('should return monthly illustList when pass {term: "month"}', (done) => {
    const opts = {
      name: 'sankaku_complex',
      term: 'month',
    };
    const sankaku_complex = Mizu.createCrawler(opts);
    sankaku_complex.prev(1, 'month').crawl()
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].title));
      done();
    })
    .catch( err => {
      console.error(err);
      done();
    });
  });

  it('should return 3 months ago illustList when pass {term: "month"} and call prev(3, "month")', (done) => {
    const opts = {
      name: 'sankaku_complex',
      term: 'month',
    };
    const sankaku_complex = Mizu.createCrawler(opts);
    sankaku_complex.prev(3, 'month').crawl()
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].title));
      return sankaku_complex.download();
    })
    .then( illustList => {
      assert(_.isArray(illustList));
      assert(_.isString(illustList[1].filename) && !_.isEmpty(illustList[1].filename));
      done();
    })
    .catch( err => {
      console.error(err);
      done();
    });
  });
});
