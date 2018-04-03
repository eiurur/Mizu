const test = require('ava');
const { DLSite } = require('../');
const { testDownloading } = require('./helpers/testDownloading');

test('should return daoly illustList when pass {term: "days"}', async (t) => {
  const initial = { term: 'days' };
  const options = { range: 'new', category: 'maniax', workTypes: ['SOU', 'MUS'] };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_new_maniax_days',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});

test('should return weekly illustList when pass {term: "weeks"}', async (t) => {
  const initial = { term: 'weeks' };
  const options = { range: 'new', category: 'maniax', workTypes: ['SOU', 'MUS'] };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_new_maniax_weeks',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});

test('should return monthly illustList when pass {term: "months"}', async (t) => {
  const initial = { term: 'months' };
  const options = { range: 'new', category: 'maniax', workTypes: ['SOU', 'MUS'] };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_new_maniax_months',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});

test('should return daoly illustList when pass {term: "days"}', async (t) => {
  const initial = { term: 'days' };
  const options = { range: 'all', category: 'books', workTypes: ['_雑誌/アンソロ', '_単行本'] };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_all_books_days',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});

test('should return weekly illustList when pass {term: "weeks"}', async (t) => {
  const initial = { term: 'weeks' };
  const options = { range: 'all', category: 'books', workTypes: ['_雑誌/アンソロ', '_単行本'] };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_all_books_weeks',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});

test('should return monthly illustList when pass {term: "months"}', async (t) => {
  const initial = { term: 'months' };
  const options = { range: 'all', category: 'books', workTypes: ['_雑誌/アンソロ', '_単行本'] };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_all_books_months',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});
