exports.service = {
  danbooru: {
    hostname: 'danbooru.donmai.us',
    domain: 'https://danbooru.donmai.us',
    endpoint: 'https://danbooru.donmai.us/explore/posts/popular',
  },
  sankaku_complex: {
    hostname: 'chan.sankakucomplex.com',
    domain: 'https://chan.sankakucomplex.com',
    post: 'https://chan.sankakucomplex.com/ja/post/show/',
    // endpoint: 'https://chan.sankakucomplex.com/ja/post/',
    endpoint: {
      days: 'https://chan.sankakucomplex.com/ja/post/popular_by_day.json',
      weeks: 'https://chan.sankakucomplex.com/ja/post/popular_by_week.json',
      months: 'https://chan.sankakucomplex.com/ja/post/popular_by_month.json',
    },
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
