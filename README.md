Mizu
======

[![Build Status](https://travis-ci.org/eiurur/Mizu.svg?branch=master)](https://travis-ci.org/eiurur/Mizu)

> Minna-no-Okazu

Downloader of popular image for the image board.

# Installation

    npm i mizu -S

# Usage

### yande.re

    const Mizu = require('mizu');

    const params = {
      name: 'yande_re',
      term: 'day',
    }

    const yandere = Mizu.createCrawler(params);

    // 今日人気だったイラストをダウンロード
    yandere.crawl()
    .then( _ => yandere.download() )
    .then( illustList => console.log(illustList) )
    .catch( err => console.error(err) );

### danbooru

    const Mizu = require('mizu');

    const params = {
      name: 'danbooru',
      term: 'week',
    }

    const danbooru = Mizu.createCrawler(params);

    // 今週人気だったイラストをダウンロード
    danbooru.crawl()
    .then( _ => danbooru.download() )
    .then( illustList => console.log(illustList) )
    .catch( err => console.error(err) );

    // 3ヶ月前の週に人気だったイラストをダウンロード
    danbooru.prev(3, 'month').crawl()
    .then( _ => danbooru.download() )
    .then( illustList => console.log(illustList) )
    .catch( err => console.error(err) );

### SankakuComplex

    const Mizu = require('mizu');

    const params = {
      name: 'sankaku_complex',
      term: 'month',
    }

    const sankaku_complex = Mizu.createCrawler(params);

    // 今月人気だったイラストをダウンロード
    sankaku_complex.crawl()
    .then( _ => sankaku_complex.download() )
    .then( illustList => console.log(illustList) )
    .catch( err => console.error(err) );

    // 2週間前の月に人気だったイラストをダウンロード
    sankaku_complex.prev(2, 'week').crawl()
    .then( _ => sankaku_complex.download() )
    .then( illustList => console.log(illustList) )
    .catch( err => console.error(err) );

    // 4週間前の月に人気だったイラスト(2ページ目)をダウンロード
    sankaku_complex.prev(2, 'week').turnPage(1).crawl()
    .then( _ => sankaku_complex.download() )
    .then( illustList => console.log(illustList) )
    .catch( err => console.error(err) );


# Support

- [x] danbooru
- [x] SankakuComplex
- [x] yande.re
