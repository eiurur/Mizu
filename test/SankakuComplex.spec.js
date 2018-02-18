const test = require('ava');
const { SankakuComplex } = require('../lib/');
const { testDownloading } = require('./helper/testDownloading');

test('should return daoly illustList when pass {term: "days"}', async (t) => {
  const options = { term: 'days' };
  const servive = new SankakuComplex(options);
  const result = await servive.download({ directory: './sankaku_complex_images_days', amount: -1 });
  testDownloading(t, result);
});

test('should return weekly illustList when pass {term: "weeks"}', async (t) => {
  const options = { term: 'weeks' };
  const servive = new SankakuComplex(options);
  const result = await servive.download({
    directory: './sankaku_complex_images_weeks',
    amount: -1,
  });
  testDownloading(t, result);
});

test('should return monthly illustList when pass {term: "months"}', async (t) => {
  const options = { term: 'months' };
  const servive = new SankakuComplex(options);
  const result = await servive.download({
    directory: './sankaku_complex_images_months',
    amount: -1,
  });
  testDownloading(t, result);
});
