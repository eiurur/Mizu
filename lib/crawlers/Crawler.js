module.exports = class Crawler {
  constructor(scraper) {
    this.scraper = scraper;
  }

  get images() {
    return this.scraper.images;
  }

  get illusts() {
    return this.scraper.illusts;
  }

  get options() {
    return {};
  }

  async crawl({ term, current, number }) {
    await this.scraper.scrape(this.options);
    number = this.convergeToZero(number);
    current = this.changeDate(term, current, number);
    if (number === 0) return this.images; // this.illustsと混ぜる？
    this.crawl({ term, current, number });
  }

  // finish() {}

  changeDate(term, current, number) {
    return current;
  }

  convergeToZero(number) {
    return number === 0 ? number : number > 0 ? number - 1 : number + 1;
  }
};
