const test = require('ava');
const { Amatsuka } = require('../');
const { testDownloading } = require('./helpers/_checker');

test('WIP', t => {
  t.pass();
});

// TODO

// test('should return daoly illustList when pass {term: "days"}', async (t) => {
//   const options = { term: 'days' };
//   const servive = new Amatsuka(options);
//   const result = await servive.download({
//     directory: './amatsuka_images_days',
//     amount: -1,
//     options: { sort: 'like' },
//   });
//   testDownloading(t, result);
// });

// test('should return weekly illustList when pass {term: "weeks"}', async (t) => {
//   const options = { term: 'weeks' };
//   const servive = new Amatsuka(options);
//   const result = await servive.download({
//     directory: './amatsuka_images_weeks',
//     amount: -1,
//     options: { sort: 'retweet' },
//   });
//   testDownloading(t, result);
// });

// test('should return monthly illustList when pass {term: "months"}', async (t) => {
//   const options = { term: 'months' };
//   const servive = new Amatsuka(options);
//   const result = await servive.download({
//     directory: './amatsuka_images_months',
//     amount: -1,
//     options: { sort: 'lustful' },
//   });
//   testDownloading(t, result);
// });

// test('should return monthly illustList when pass {term: "months"} and {options: {sort: "total"} }', async (t) => {
//   const options = { term: 'months' };
//   const servive = new Amatsuka(options);
//   const result = await servive.download({
//     directory: './amatsuka_images_months',
//     amount: -1,
//     options: { sort: 'total' },
//   });
//   testDownloading(t, result);
// });
