const client = require('cheerio-httpcli');

module.exports = class Scraper {
  constructor({ debug = false } = {}) {
    this.debug = debug;
  }

  async fetch({ url, query }) {
    if (this.debug) console.log('Scraper => ', url, query);
    return await client.fetch(url, query);
  }

  scrape() {
    throw new Error('not implemented');
  }
};
