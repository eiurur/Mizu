const {
  AmatsukaScraper,
  DanbooruScraper,
  SankakuComplexScraper,
  YandereScraper,
} = require('./scrapers/');

const {
  AmatsukaDownloader,
  DanbooruDownloader,
  YandereDownloader,
  SankakuComplexDownloader,
} = require('./downloaders/');

const { create } = require('./services/');

module.exports = {
  Amatsuka: create({ scraper: AmatsukaScraper, downloader: AmatsukaDownloader }),
  Danbooru: create({ scraper: DanbooruScraper, downloader: DanbooruDownloader }),
  Yandere: create({ scraper: YandereScraper, downloader: YandereDownloader }),
  SankakuComplex: create({ scraper: SankakuComplexScraper, downloader: SankakuComplexDownloader }),
};
