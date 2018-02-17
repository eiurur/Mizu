const _ = require('lodash');
const test = require('ava');
const { Yandere } = require('../lib/');

const testDownloading = (t, result) => {
  try {
    t.true(Array.isArray(result));
    t.true(_.isString(result[1].filename));
  } catch (e) {
    console.log(e);
    t.fail();
  }
};

test('should return daoly illustList when pass {term: "days"}', async (t) => {
  const options = { term: 'days' };
  const yandere = new Yandere(options);
  const result = await yandere.download({ directory: './yandere_images_days', amount: 0 });
  testDownloading(t, result);
});

test('should return weekly illustList when pass {term: "weeks"}', async (t) => {
  const options = { term: 'weeks' };
  const yandere = new Yandere(options);
  const result = await yandere.download({ directory: './yandere_images_weeks', amount: 0 });
  testDownloading(t, result);
});

test('should return monthly illustList when pass {term: "months"}', async (t) => {
  const options = { term: 'months' };
  const yandere = new Yandere(options);
  const result = await yandere.download({ directory: './yandere_images_months', amount: 0 });
  testDownloading(t, result);
});
