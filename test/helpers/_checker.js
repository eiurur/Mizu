exports.testScraping = (t, result) => {
  try {
    t.true(typeof result[1].title === 'string');
    t.true(typeof result[1].source === 'string');
    t.true(Array.isArray(result));
  } catch (e) {
    console.log(e);
    t.fail();
  }
};

exports.testDownloading = (t, result) => {
  try {
    t.true(Array.isArray(result));
    t.true(typeof result[1].filename === 'string');
  } catch (e) {
    console.log(e);
    t.fail();
  }
};
