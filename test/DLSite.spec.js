const test = require('ava');
const { DLSite } = require('../');
const { testDownloading } = require('./helpers/testDownloading');

test('should return daoly illustList when pass {term: "days"} and category, sub', async (t) => {
  const initial = { term: 'days' };
  const options = {
    type: 'maniax',
    category: 'voice',
    sub: 'SOU',
    affiliateId: 'kawpaa',
  };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_new_maniax_voice_sou_days',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});

test('should return weekly illustList when pass {term: "weeks"} and category, sub', async (t) => {
  const initial = { term: 'weeks' };
  const options = {
    type: 'maniax',
    category: 'voice',
    sub: 'SOU',
    affiliateId: 'kawpaa',
  };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_new_maniax_voice_sou_weeks',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});

test('should return monthly illustList when pass {tern: "month"}  and category, sub', async (t) => {
  const initial = { term: 'months' };
  const options = {
    type: 'maniax',
    category: 'voice',
    sub: 'SOU',
    affiliateId: 'kawpaa',
  };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_new_maniax_voice_sou_months',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});

test('should return monthly illustList when pass {term: "months"} and cateory, skip, limit', async (t) => {
  const initial = { term: 'months' };
  const options = {
    type: 'maniax',
    category: 'game',
    skip: 0,
    limit: 50,
  };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_new_maniax_game_months_skip_limit',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});

test('should return daoly illustList when pass {term: "days"} at books', async (t) => {
  const initial = { term: 'days' };
  const options = { type: 'books', category: 'magazin' };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_all_books_days',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});

test('should return weekly illustList when pass {term: "weeks"} at books', async (t) => {
  const initial = { term: 'weeks' };
  const options = { type: 'books', category: 'comic' };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_all_books_weeks',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});

test('should return weekly illustList when pass {term: "weeks"} and date at books', async (t) => {
  const initial = { term: 'weeks' };
  const options = { type: 'books', category: 'comic', date: 'new' };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_all_books_new_weeks',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});

test('should return weekly illustList when pass {term: "weeks"} and date at books', async (t) => {
  const initial = { term: 'weeks' };
  const options = { type: 'books', category: 'comic', date: 'all' };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_all_books_all_weeks',
    amount: -1,
    options,
  });
  testDownloading(t, result);
});
