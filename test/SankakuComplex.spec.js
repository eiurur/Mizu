const test = require('ava');
const { SankakuComplex } = require('../');
const { testDownloading } = require('./helpers/testDownloading');

test('should return daoly illustList when pass {term: "days"}', async (t) => {
  const initial = { term: 'days' };
  const servive = new SankakuComplex(initial);
  const result = await servive.download({ directory: './sankaku_complex_images_days', amount: -1 });
  testDownloading(t, result);
});

test('should return weekly illustList when pass {term: "weeks"}', async (t) => {
  const initial = { term: 'weeks' };
  const servive = new SankakuComplex(initial);
  const result = await servive.download({
    directory: './sankaku_complex_images_weeks',
    amount: -1,
  });
  testDownloading(t, result);
});

test('should return monthly illustList when pass {term: "months"}', async (t) => {
  const initial = { term: 'months' };
  const servive = new SankakuComplex(initial);
  const result = await servive.download({
    directory: './sankaku_complex_images_months',
    amount: -1,
  });
  testDownloading(t, result);
});
