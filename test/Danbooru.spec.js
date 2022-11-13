const test = require('ava');
const { Danbooru } = require('../');
const { testDownloading } = require('./helpers/_checker');
const auth = {
  login: process.env.DANBOORU_USERNAME,
  api_key: process.env.DANBOORU_API_KEY,
};

test('should return daoly illustList when pass {term: "days"}', async (t) => {
  const initial = { term: 'days', auth };
  const servive = new Danbooru(initial);
  const result = await servive.download({
    directory: './danbooru_images_days',
    amount: -1,
  });
  testDownloading(t, result);
});

test('should return weekly illustList when pass {term: "weeks"}', async (t) => {
  const initial = { term: 'weeks', auth };
  const servive = new Danbooru(initial);
  const result = await servive.download({
    directory: './danbooru_images_weeks',
    amount: -1,
  });
  testDownloading(t, result);
});

test('should return monthly illustList when pass {term: "months"}', async (t) => {
  const initial = { term: 'months', auth };
  const servive = new Danbooru(initial);
  const result = await servive.download({
    directory: './danbooru_images_months',
    amount: -1,
  });
  testDownloading(t, result);
});
