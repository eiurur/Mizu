exports.testDownloading = (t, result) => {
  try {
    t.true(Array.isArray(result));
    t.true(typeof result[1].filename === 'string');
  } catch (e) {
    console.log(e);
    t.fail();
  }
};
