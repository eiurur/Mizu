const _ = require('lodash');
const test = require('ava');
const { Yandere } = require('../');
const { testDownloading } = require('./helpers/_testDownloading');

test('should return daoly illustList when pass {term: "days"}', async (t) => {
  const initial = { term: 'days' };
  const yandere = new Yandere(initial);
  const result = await yandere.download({ directory: './yandere_images_days', amount: -1 });
  testDownloading(t, result);
});

test('should return weekly illustList when pass {term: "weeks"}', async (t) => {
  const initial = { term: 'weeks' };
  const yandere = new Yandere(initial);
  const result = await yandere.download({ directory: './yandere_images_weeks', amount: -1 });
  testDownloading(t, result);
});

test('should return monthly illustList when pass {term: "months"}', async (t) => {
  const initial = { term: 'months' };
  const yandere = new Yandere(initial);
  const result = await yandere.download({ directory: './yandere_images_months', amount: -1 });
  testDownloading(t, result);
});
