Mizu
======

[![Build Status](https://travis-ci.org/eiurur/Mizu.svg?branch=master)](https://travis-ci.org/eiurur/Mizu)

> Minna-no-Okazu

有名どころの画像掲示板からPopular画像をダウンロードするやつ

# Installation

    npm i mizu -S

# Usage

### yande.re

    const Mizu = require('mizu');

    const params = {
      name: 'yande_re',
      term: 'day',
    }

    const yandere = Mizu.createScraper(params);

    // 今日人気だったイラストをダウンロード
    yandere.crawl()
    .then( _ => yandere.downloadIllusts() )
    .then( illustList => console.log(illustList) )
    .catch( err => console.error(err) );

### danbooru

[WIP]

    const Mizu = require('mizu');

    const params = {
      name: 'danbooru',
      term: 'week',
    }

    const danbooru = Mizu.createScraper(params);

    // 今週人気だったイラストをダウンロード
    danbooru.crawl()
    .then( _ => danbooru.downloadIllusts() )
    .then( illustList => console.log(illustList) )
    .catch( err => console.error(err) );

    // 3ヶ月前に人気だったイラストをダウンロード
    danbooru.prev(3, 'month').crawl()
    .then( _ => danbooru.downloadIllusts() )
    .then( illustList => console.log(illustList) )
    .catch( err => console.error(err) );

### SankakuComplex

[WIP]

    const Mizu = require('mizu');

    const params = {
      name: 'sankaku_complex',
      term: 'month',
    }

    const sankaku_complex = Mizu.createScraper(params);

    // 今月人気だったイラストをダウンロード
    sankaku_complex.crawl()
    .then( _ => sankaku_complex.downloadIllusts() )
    .then( illustList => console.log(illustList) )
    .catch( err => console.error(err) );

    // 2週間前に人気だったイラストをダウンロード
    sankaku_complex.prev(2, 'week').crawl()
    .then( _ => sankaku_complex.downloadIllusts() )
    .then( illustList => console.log(illustList) )
    .catch( err => console.error(err) );


# Support

- [ ] danbooru
- [ ] SankakuComplex
- [x] yande.re
