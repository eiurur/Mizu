# Mizu

![Node.js CI](https://github.com/eiurur/Mizu/workflows/Node.js%20CI/badge.svg?branch=master)

> Minna-no-Okazu

Downloader of popular images for the image board.

# Support

**Illust (2D)**

- [x] danbooru
- [x] SankakuComplex
- [x] yande.re

**Shop**

- [x] DLSite

# Installation

    npm i mizu -S

# Usage

```js
const { Yandere, SankakuComplex, Danbooru } = require('mizu');

(async () => {
  /**
   * yande.re days
   */
  const initial = { term: 'days', date: '2018-02-15' };
  const yandere = new Yandere(initial);

  // 2018-02-15
  const r_yandere1 = await yandere.download({
    directory: './yandere_images_days',
    amount: 0,
  });

  // 2018-02-14
  const r_yandere2 = await yandere.download({
    directory: './yandere_images_days',
    amount: -1,
  });

  // 2018-02-17
  const r_yandere3 = await yandere.download({
    directory: './yandere_images_days',
    amount: 2,
  });

  /**
   * SankakuComplex weeks
   */
  const initial = { term: 'weeks', date: '2018-02-15' };
  const sankakuComplex = new SankakuComplex(initial);

  // 2018-02-15
  const r_sankakuComplex1 = await sankakuComplex.download({
    directory: './sankakuComplex_images_weeks',
    amount: 0,
  });

  // 2018-02-08
  const r_sankakuComplex2 = await sankakuComplex.download({
    directory: './sankakuComplex_images_weeks',
    amount: -1,
  });

  // 2018-03-01
  const r_sankakuComplex3 = await sankakuComplex.download({
    directory: './sankakuComplex_images_weeks',
    amount: 2,
  });

  /**
   * Danbooru months
   */
  /* 
    requirement under permssions: 
      explore/posts:popular
      explore/posts:searche
      explore/posts:viewed
      posts:show
  */
  const auth = { login: 'YOUR_DANBOORU_USERNAME', api_key: 'YOUR_DANBOORU_API_KEY' };
  const initial = { term: 'months', date: '2018-03-15', auth };
  const danbooru = new Danbooru(initial);

  // 2018-03
  const r_danbooru1 = await danbooru.download({
    directory: './danbooru_images_months',
    amount: 0,
  });

  // 2018-02
  const r_danbooru2 = await danbooru.download({
    directory: './danbooru_images_months',
    amount: -1,
  });

  // 2018-05
  const r_danbooru3 = await danbooru.download({
    directory: './danbooru_images_months',
    amount: 2,
  });

  /**
   * Amatsuks TODO
   */

  /**
   * DLSite
   */
  // 期間 = days, 販売日 = all, カテゴリ = 電子書籍, 作品タイプ = 雑誌/アンソロ または 単行本
  const initial = { term: 'days' };
  const options = {
    range: 'all',
    type: 'books',
    category: 'magazines',
  };
  const servive = new DLSite(initial);
  const result = await servive.download({
    directory: './dlsite_all_books_days',
    amount: 0,
    options,
  });

  // 期間 = weeks, 販売日 = 30日以内, カテゴリ = 同人, 作品タイプ = 音声作品, アフィリエイトIDを付与
  const initial = { term: 'weeks' };
  const options = {
    range: 'new',
    type: 'maniax',
    category: 'voice',
    sub: 'SOU',
    affiliateId: 'kawpaa',
  };
  const servive = new DLSite(initial);
  const r_dlsite1 = await servive.download({
    directory: './dlsite_new_maniax_weeks',
    amount: 0,
    options,
  });
})();
```

### Output (Example)

```js
const { Yandere } = require('mizu');

(async () => {
  const options = { term: 'days', date: '2018-02-15' };
  const yandere = new Yandere(options);

  const result = await yandere.download({
    directory: './yandere_images_days',
    amount: 0,
  });

  console.log(result)
})();

↓

[
  {
    title: 'Rating: Explicit Score: 126 Tags: bra breasts dakimakura nipples pantsu panty_pull pussy shouna_mitsuishi stylus User: DDD',
    source: 'https://yande.re/post/show/433202',
    ext: '.jpg',
    images:
    {
      large: 'https://files.yande.re/sample/6cc19d02c799c4188cd0879ea4c1204d/yande.re%20433202%20sample%20bra%20breasts%20dakimakura%20nipples%20pantsu%20panty_pull%20pussy%20shouna_mitsuishi%20stylus.jpg',
      medium: 'https://files.yande.re/sample/6cc19d02c799c4188cd0879ea4c1204d/yande.re%20433202%20sample%20bra%20breasts%20dakimakura%20nipples%20pantsu%20panty_pull%20pussy%20shouna_mitsuishi%20stylus.jpg'
    },
    filename: '2d11847a6289b5385ed50977af06ad3f0ef9d41ecd77d0edcc98000718513c81.jpg',
    filepath: 'D:\\workspace\\Github\\development_projects\\00_developing\\Mizu\\yandere_images_months\\2d11847a6289b5385ed50977af06ad3f0ef9d41ecd77d0edcc98000718513c81.jpg'
  },
  {
    title: 'Rating: Explicit Score: 125 Tags: bathing breast_hold n.g. naked nipples pussy uncensored wet User: mash',
    source: 'https://yande.re/post/show/433957',
    ext: '.jpg',
    images:
    {
      large: 'https://files.yande.re/jpeg/cb1af6f50b60e336b9da45a285233ba8/yande.re%20433957%20bathing%20breast_hold%20n.g.%20naked%20nipples%20pussy%20uncensored%20wet.jpg',
      medium: 'https://files.yande.re/sample/cb1af6f50b60e336b9da45a285233ba8/yande.re%20433957%20bathing%20breast_hold%20n.g.%20naked%20nipples%20pussy%20uncensored%20wet.jpg'
    },
    filename: '008df2822591b4e7359ada067b3537275ca71942934381ad390371f26d1ab4b3.jpg',
    filepath: 'D:\\workspace\\Github\\development_projects\\00_developing\\Mizu\\yandere_images_months\\008df2822591b4e7359ada067b3537275ca71942934381ad390371f26d1ab4b3.jpg'
  }
]
```
