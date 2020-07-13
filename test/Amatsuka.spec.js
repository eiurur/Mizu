const test = require('ava');
const { Amatsuka } = require('..');
const { testDownloading } = require('./helpers/_checker');

test('WIP', (t) => {
  t.pass();
});

test('should return daoly illustList when pass {term: "days",  sort: "like"}', async (t) => {
  const options = { term: 'days', date: '2020-06-21' };
  const servive = new Amatsuka(options);
  const result = await servive.download({
    directory: './amatsuka_images_days',
    amount: -1,
    options: { sort: 'like', limit: 10 },
  });
  testDownloading(t, result);
});
test('should return weekly illustList when pass {term: "weeks", sort: "like"}', async (t) => {
  const options = { term: 'weeks' };
  const servive = new Amatsuka(options);
  const result = await servive.download({
    directory: './amatsuka_images_weeks_like',
    amount: -1,
    options: { sort: 'like', limit: 10 },
  });
  testDownloading(t, result);
});
test('should return weekly illustList when pass {term: "weeks", sort: "retweet"}', async (t) => {
  const options = { term: 'weeks' };
  const servive = new Amatsuka(options);
  const result = await servive.download({
    directory: './amatsuka_images_weeks_retweet',
    amount: -1,
    options: { sort: 'retweet', limit: 10 },
  });
  testDownloading(t, result);
});

test('should return monthly illustList when pass {term: "months"}', async (t) => {
  const options = { term: 'months' };
  const servive = new Amatsuka(options);
  const result = await servive.download({
    directory: './amatsuka_images_months_lustful',
    amount: -1,
    options: { sort: 'lustful', limit: 10 },
  });
  testDownloading(t, result);
});

test('should return monthly illustList when pass {term: "months"} and {options: {sort: "total"} }', async (t) => {
  const options = { term: 'months' };
  const servive = new Amatsuka(options);
  const result = await servive.download({
    directory: './amatsuka_images_months_total',
    amount: -1,
    options: { sort: 'total', limit: 10 },
  });
  testDownloading(t, result);
});

test('should return monthly illustList when pass {term: "months"} and {options: {sort: "like"} }', async (t) => {
  const options = { term: 'months' };
  const servive = new Amatsuka(options);
  const result = await servive.download({
    directory: './amatsuka_images_months_like',
    amount: -1,
    options: { sort: 'like', limit: 10 },
  });
  testDownloading(t, result);
});
