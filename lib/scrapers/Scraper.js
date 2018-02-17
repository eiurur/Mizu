const client = require('cheerio-httpcli');

module.exports = class Scraper {
  constructor() {}

  async fetch({ url, query }) {
    console.log(url, query);
    return await client.fetch(url, query);
  }

  scrape() {
    throw new Error('not implemented');
  }
};
