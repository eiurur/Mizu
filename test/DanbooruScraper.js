"use strict";

const _ = require("lodash");
const moment = require("moment");
const assert = require("power-assert");
const Mizu = require("../");

describe("DanbooruScraper", () => {
  it("should return hostname(danbooru.donmai.us) when get hostname", () => {
    const opts = {
      name: "danbooru",
      term: "day"
    };
    const crawler = Mizu.createCrawler(opts);
    assert(crawler.hostname === "danbooru.donmai.us");
  });

  it("should add date", () => {
    const opts = {
      name: "danbooru",
      term: "day"
    };
    const crawler = Mizu.createCrawler(opts);
    assert(
      crawler.next(1, "day").date ===
      moment().add(1, "days").format("YYYY-MM-DD")
    );
    assert(
      crawler.next(1, "week").date ===
      moment().add(1, "days").add(1, "weeks").format("YYYY-MM-DD")
    );
    assert(
      crawler.next(1, "month").date ===
      moment()
        .add(1, "days")
        .add(1, "weeks")
        .add(1, "months")
        .format("YYYY-MM-DD")
    );
  });

  it("should sbstract date", () => {
    const opts = {
      name: "danbooru",
      term: "day"
    };
    const crawler = Mizu.createCrawler(opts);
    assert(
      crawler.prev(2, "day").date ===
      moment().subtract(2, "days").format("YYYY-MM-DD")
    );
    assert(
      crawler.prev(2, "week").date ===
      moment().subtract(2, "days").subtract(2, "weeks").format("YYYY-MM-DD")
    );
    assert(
      crawler.prev(2, "month").date ===
      moment()
        .subtract(2, "days")
        .subtract(2, "weeks")
        .subtract(2, "months")
        .format("YYYY-MM-DD")
    );
  });

  it('should return daily illustList when pass {term: "day"}', done => {
    const opts = {
      name: "danbooru",
      term: "day"
    };
    const crawler = Mizu.createCrawler(opts);
    crawler
      .prev(1, "day")
      .crawl()
      .then(illustList => {
        assert(_.isArray(illustList));
        assert(_.isString(illustList[1].title));
        done();
      })
      .catch(err => {
        console.error(err);
        done();
      });
  });

  it('should return weekly illustList when pass {term: "week"}', done => {
    const opts = {
      name: "danbooru",
      term: "week",
      directory: "danbooru_test_images_week"
    };
    const crawler = Mizu.createCrawler(opts);
    crawler
      .prev(1, "day")
      .crawl()
      .then(illustList => {
        assert(_.isArray(illustList));
        assert(_.isString(illustList[1].title));

        return crawler.download();
      })
      .then(illustList => {
        assert(_.isArray(illustList));
        assert(
          _.isString(illustList[1].filename) &&
          !_.isEmpty(illustList[1].filename)
        );
        done();
      })
      .catch(err => {
        console.error(err);
        done();
      });
  });

  it('should return monthly illustList when pass {term: "month"}', done => {
    const opts = {
      name: "danbooru",
      term: "month"
    };
    const crawler = Mizu.createCrawler(opts);
    crawler
      .prev(1, "month")
      .crawl()
      .then(illustList => {
        assert(_.isArray(illustList));
        assert(_.isString(illustList[1].title));
        done();
      })
      .catch(err => {
        console.error(err);
        done();
      });
  });

  it('should return 3 months ago illustList when pass {term: "month"} and call prev(3, "month")', done => {
    const opts = {
      name: "danbooru",
      term: "month"
    };
    const crawler = Mizu.createCrawler(opts);
    crawler
      .prev(3, "month")
      .crawl()
      .then(illustList => {
        assert(_.isArray(illustList));
        assert(_.isString(illustList[1].title));
        return crawler.download();
      })
      .then(illustList => {
        assert(_.isArray(illustList));
        assert(
          _.isString(illustList[1].filename) &&
          !_.isEmpty(illustList[1].filename)
        );
        done();
      })
      .catch(err => {
        console.error(err);
        done();
      });
  });
});
