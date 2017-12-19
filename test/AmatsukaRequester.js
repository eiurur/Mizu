'use strict';

const _ = require('lodash');
const moment = require('moment');
const assert = require('power-assert');
const Mizu = require('../');

describe('AmatsukaRequester', () => {
  it('should return hostname(amatsuka.herokuapp.com) when get hostname', () => {
    const opts = {
      name: 'amatsuka',
      term: 'day',
    };
    const amatsuka = Mizu.createCrawler(opts);
    assert(amatsuka.hostname === 'amatsuka.herokuapp.com');
  });

  // it('should add date', () => {
  //   const opts = {
  //     name: 'amatsuka',
  //     term: 'day',
  //   };
  //   const amatsuka = Mizu.createCrawler(opts);
  //   assert(amatsuka.next(1, 'day').date === moment().add(1, 'days').format('YYYY-MM-DD'));
  //   assert(amatsuka.next(1, 'week').date === moment().add(1, 'days').add(1, 'weeks').format('YYYY-MM-DD'));
  //   assert(amatsuka.next(1, 'month').date === moment().add(1, 'days').add(1, 'weeks').add(1, 'months').format('YYYY-MM-DD'));
  // });

  // it('should sbstract date', () => {
  //   const opts = {
  //     name: 'amatsuka',
  //     term: 'day',
  //   };
  //   const amatsuka = Mizu.createCrawler(opts);
  //   assert(amatsuka.date === moment().subtract(2, 'days').format('YYYY-MM-DD'));
  //   assert(amatsuka.date === moment().subtract(2, 'days').subtract(2, 'weeks').format('YYYY-MM-DD'));
  //   assert(amatsuka.date === moment().subtract(2, 'days').subtract(2, 'weeks').subtract(2, 'months').format('YYYY-MM-DD'));
  // });

  // it('should turnPage', () => {
  //   const opts = {
  //     name: 'amatsuka',
  //     term: 'day',
  //   };
  //   const amatsuka = Mizu.createCrawler(opts);
  //   assert(amatsuka.page === 1);
  //   assert(amatsuka.turnPage(1).page === 2);
  //   assert(amatsuka.turnPage(2).page === 4);
  //   assert(amatsuka.turnPage(-1).page === 3);
  //   assert(amatsuka.turnPage(-100).page === 1);
  // });

  it('should return daily illustList when pass {sortType:"like", term: "day"}', done => {
    const opts = {
      name: 'amatsuka',
      sortType: 'like',
      term: 'day',
      date: moment()
        .add('day', -2)
        .format('YYYY-MM-DD'),
    };
    const amatsuka = Mizu.createCrawler(opts);
    amatsuka
      .crawl()
      .then(illustList => {
        assert(_.isArray(illustList));
        assert(_.isString(illustList[1].title));
        done();
      })
      .catch(err => {
        console.error(err);
        done();
      });
  });

  it('should return weekly illustList when pass {sortType:"retweet", term: "week"}', done => {
    const opts = {
      name: 'amatsuka',
      sortType: 'retweet',
      term: 'week',
      date: moment()
        .add('week', -2)
        .format('YYYY-MM-DD'),
      directory: 'amatsuka_test_images_retweet_week',
    };
    const amatsuka = Mizu.createCrawler(opts);
    amatsuka
      .crawl()
      .then(illustList => {
        assert(_.isArray(illustList));
        assert(_.isString(illustList[1].title));
        return amatsuka.download();
      })
      .then(illustList => {
        assert(_.isArray(illustList));
        assert(
          _.isString(illustList[1].filename) &&
            !_.isEmpty(illustList[1].filename),
        );
        done();
      })
      .catch(err => {
        console.error(err);
        done();
      });
  });

  it('should return monthly illustList when pass {sortType: "total", term: "month"}', done => {
    const opts = {
      name: 'amatsuka',
      sortType: 'total',
      term: 'month',
      date: moment()
        .add('month', -2)
        .format('YYYY-MM-DD'),
      directory: 'amatsuka_test_images_total_month',
    };
    const amatsuka = Mizu.createCrawler(opts);
    amatsuka
      .crawl()
      .then(illustList => {
        assert(_.isArray(illustList));
        assert(_.isString(illustList[1].title));

        return amatsuka.download();
      })
      .then(illustList => {
        assert(_.isArray(illustList));
        assert(
          _.isString(illustList[1].filename) &&
            !_.isEmpty(illustList[1].filename),
        );
        done();
      })
      .catch(err => {
        console.error(err);
        done();
      });
  });

  // it('should return monthly illustList of the 2nd page when pass {term: "month"}', done => {
  //   const opts = {
  //     name: 'amatsuka',
  //     term: 'month',
  //     directory: 'amatsuka_test_images_month',
  //   };
  //   const amatsuka = Mizu.createCrawler(opts);
  //   amatsuka
  //     .crawl()
  //     .then(illustList => {
  //       assert(_.isArray(illustList));
  //       assert(_.isString(illustList[1].title));

  //       return amatsuka.download();
  //     })
  //     .then(illustList => {
  //       assert(_.isArray(illustList));
  //       assert(
  //         _.isString(illustList[1].filename) &&
  //           !_.isEmpty(illustList[1].filename),
  //       );
  //       done();
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       done();
  //     });
  // });

  // it('should return monthly illustList when pass {term: "month"}', done => {
  //   const opts = {
  //     name: 'amatsuka',
  //     term: 'month',
  //   };
  //   const amatsuka = Mizu.createCrawler(opts);
  //   amatsuka
  //     .crawl()
  //     .then(illustList => {
  //       assert(_.isArray(illustList));
  //       assert(_.isString(illustList[1].title));
  //       done();
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       done();
  //     });
  // });

  // it('should return 3 months ago illustList when pass {term: "month"} and call prev(3, "month")', done => {
  //   const opts = {
  //     name: 'amatsuka',
  //     term: 'month',
  //   };
  //   const amatsuka = Mizu.createCrawler(opts);
  //   amatsuka
  //     .crawl()
  //     .then(illustList => {
  //       assert(_.isArray(illustList));
  //       assert(_.isString(illustList[1].title));
  //       return amatsuka.download();
  //     })
  //     .then(illustList => {
  //       assert(_.isArray(illustList));
  //       assert(
  //         _.isString(illustList[1].filename) &&
  //           !_.isEmpty(illustList[1].filename),
  //       );
  //       done();
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       done();
  //     });
  // });
});