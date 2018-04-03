const {
  AmatsukaScraper,
  DanbooruScraper,
  DLSiteScraper,
  SankakuComplexScraper,
  YandereScraper,
} = require('./scrapers/');

const {
  AmatsukaDownloader,
  DanbooruDownloader,
  DLSiteDownloader,
  YandereDownloader,
  SankakuComplexDownloader,
} = require('./downloaders/');

const { create } = require('./services/');

module.exports = {
  Amatsuka: create({ scraper: AmatsukaScraper, downloader: AmatsukaDownloader }),
  Danbooru: create({ scraper: DanbooruScraper, downloader: DanbooruDownloader }),
  DLSite: create({ scraper: DLSiteScraper, downloader: DLSiteDownloader }),
  Yandere: create({ scraper: YandereScraper, downloader: YandereDownloader }),
  SankakuComplex: create({ scraper: SankakuComplexScraper, downloader: SankakuComplexDownloader }),
};
