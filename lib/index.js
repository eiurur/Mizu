const { DanbooruScraper, DLSiteScraper, SankakuComplexScraper, YandereScraper } = require('./scrapers/');
const { DanbooruDownloader, DLSiteDownloader, YandereDownloader, SankakuComplexDownloader } = require('./downloaders/');
const { create } = require('./services/');

module.exports = {
  Danbooru: create({ scraper: DanbooruScraper, downloader: DanbooruDownloader }),
  DLSite: create({ scraper: DLSiteScraper, downloader: DLSiteDownloader }),
  Yandere: create({ scraper: YandereScraper, downloader: YandereDownloader }),
  SankakuComplex: create({ scraper: SankakuComplexScraper, downloader: SankakuComplexDownloader }),
};
