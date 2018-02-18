const _ = require('lodash');

exports.testDownloading = (t, result) => {
  try {
    t.true(Array.isArray(result));
    t.true(_.isString(result[1].filename));
  } catch (e) {
    console.log(e);
    t.fail();
  }
};
