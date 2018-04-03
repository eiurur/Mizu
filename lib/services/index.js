const moment = require('moment');
const { ALLOWABLED_TERMS } = require('../configs/constants');

const create = ({ scraper, downloader }) => {
  const Scraper = scraper;
  const Downloader = downloader;
  return class {
    constructor({ term, date }) {
      term = term || '';
      date = date || moment().format('YYYY-MM-DD');
      this.term = term.toLowerCase();
      this.mDate = moment(date, 'YYYY-MM-DD', true);
      this.guardConstructorParameters();
    }

    async download({ directory, amount, options }) {
      this.guardDowenloadParameters({ directory, amount });
      const mDate = this.mDate.add(amount, this.term);
      const contents = await new Scraper({
        term: this.term,
        date: mDate,
      }).scrape(options);
      const result = await new Downloader({ directory }).download(contents);
      return result;
    }

    guardConstructorParameters() {
      if (!ALLOWABLED_TERMS.includes(this.term)) {
        throw new Error("pass appropriate term. ('days' or 'weesk' or 'months')");
      }
      if (!this.mDate.isValid()) {
        throw new Error("pass appropriate date. ('YYYY-MM-DD') -> i.e. : '2018-09-12'");
      }
    }

    guardDowenloadParameters({ directory, amount }) {
      if (!directory) {
        throw new Error("pass appropriate directory path. -> i.e. : '/path/to/images'");
      }
      if (!Number.isInteger(amount)) {
        throw new Error('pass appropriate amount. -> i.e. : 0, 5, -12 ');
      }
    }

    wait(ms = 1000 + 1000 * Math.random()) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  };
};

module.exports = { create };
