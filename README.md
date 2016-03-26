Mizu
======

> Minna-no-Okazu

有名どころの画像掲示板からPopular画像をダウンロードするやつ

# Installation

    npm i mizu -S

# Usage

    const Mizu = require('mizu');

    const params = {
      name: 'yande_re',
      term: 'week',
    }

    const yandere = Mizu.createScpraper(params);

    const yandere.crawl().then( result => console.log(result) );

# Support

- [ ] danbooru
- [ ] SankakuComplex
- [ ] yande.re
