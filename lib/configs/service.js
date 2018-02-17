exports.service = {
  danbooru: {
    hostname: 'danbooru.donmai.us',
    domain: 'https://danbooru.donmai.us',
    endpoint: 'https://danbooru.donmai.us/explore/posts/popular',
  },
  sankaku_complex: {
    hostname: 'chan.sankakucomplex.com',
    domain: 'https://chan.sankakucomplex.com',
    endpoint: 'https://chan.sankakucomplex.com/ja/post/',
  },
  yande_re: {
    hostname: 'yande.re',
    domain: 'https://yande.re',
    // endpoint: 'https://yande.re/post/popular_recent',
    endpoint: {
      days: 'https://yande.re/post/popular_by_day',
      weeks: 'https://yande.re/post/popular_by_week',
      months: 'https://yande.re/post/popular_by_month',
    },
  },
  nijie: {},
  iwara: {},
  eroterest: {},
};
