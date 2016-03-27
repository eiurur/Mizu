// 'use strict';

// const _      = require('lodash');
// const moment = require('moment');
// const assert = require('power-assert');
// const Mizu   = require('../');

// describe('SankakuComplexScraper', () => {
//   it('should return daily illustList when pass {term: "day"}', (done) => {
//     const opts = {
//       name: 'sankaku_complex',
//       term: 'day',
//     };
//     const sankaku_complex = Mizu.createScraper(opts);
//     sankaku_complex.crawl()
//     .then( illustList => {
//       assert(_.isArray(illustList));
//       // assert(_.isString(illustList[1].title));
//       done();
//     });
//   });

//   it('should return weekly illustList when pass {term: "week"}', (done) => {
//     const opts = {
//       name: 'sankaku_complex',
//       term: 'week',
//       directory: 'sankaku_complex_test_images_week',
//     };
//     const sankaku_complex = Mizu.createScraper(opts);
//     sankaku_complex.crawl()
//     .then( illustList => {
//       assert(_.isArray(illustList));
//       assert(_.isString(illustList[1].title));

//       return sankaku_complex.downloadIllusts();
//     })
//     .then( illustList => {
//       assert(_.isArray(illustList));
//       assert(_.isString(illustList[1].filename));
//       done();
//     });
//   });

//   it('should return monthly illustList when pass {term: "month"}', (done) => {
//     const opts = {
//       name: 'sankaku_complex',
//       term: 'month',
//       directory: 'sankaku_complex_test_images_month',
//     };
//     const sankaku_complex = Mizu.createScraper(opts);
//     sankaku_complex.crawl()
//     .then( illustList => {
//       assert(_.isArray(illustList));
//       assert(_.isString(illustList[1].title));

//       return sankaku_complex.downloadIllusts();
//     })
//     .then( illustList => {
//       assert(_.isArray(illustList));
//       assert(_.isString(illustList[1].filename));
//       done();
//     });
//   });

//   it('should return monthly illustList when pass {term: "month"}', (done) => {
//     const opts = {
//       name: 'sankaku_complex',
//       term: 'month',
//     };
//     const sankaku_complex = Mizu.createScraper(opts);
//     sankaku_complex.crawl()
//     .then( illustList => {
//       assert(_.isArray(illustList));
//       assert(_.isString(illustList[1].title));
//       done();
//     });
//   });

//   it('should add date', () => {
//     const opts = {
//       name: 'sankaku_complex',
//       term: 'day',
//     };
//     const sankaku_complex = Mizu.createScraper(opts);
//     assert(sankaku_complex.next(1, 'day').date === moment().add(1, 'days').format('YYYY-MM-DD'));
//     assert(sankaku_complex.next(1, 'week').date === moment().add(1, 'days').add(1, 'weeks').format('YYYY-MM-DD'));
//     assert(sankaku_complex.next(1, 'month').date === moment().add(1, 'days').add(1, 'weeks').add(1, 'months').format('YYYY-MM-DD'));
//   });

//   it('should sbstract date', () => {
//     const opts = {
//       name: 'sankaku_complex',
//       term: 'day',
//     };
//     const sankaku_complex = Mizu.createScraper(opts);
//     assert(sankaku_complex.prev(2, 'day').date === moment().subtract(2, 'days').format('YYYY-MM-DD'));
//     assert(sankaku_complex.prev(2, 'week').date === moment().subtract(2, 'days').subtract(2, 'weeks').format('YYYY-MM-DD'));
//     assert(sankaku_complex.prev(2, 'month').date === moment().subtract(2, 'days').subtract(2, 'weeks').subtract(2, 'months').format('YYYY-MM-DD'));
//   });

//   it('should return 3 months ago illustList when pass {term: "month"} and call prev(3, "month")', (done) => {
//     const opts = {
//       name: 'sankaku_complex',
//       term: 'month',
//     };
//     const sankaku_complex = Mizu.createScraper(opts);
//     sankaku_complex.prev(3, 'month').crawl()
//     .then( illustList => {
//       assert(_.isArray(illustList));
//       assert(_.isString(illustList[1].title));
//       return sankaku_complex.downloadIllusts();
//     })
//     .then( illustList => {
//       assert(_.isArray(illustList));
//       assert(_.isString(illustList[1].filename));
//       done();
//     });
//   });
// });
