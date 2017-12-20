# Mizu

[![Build Status](https://travis-ci.org/eiurur/Mizu.svg?branch=master)](https://travis-ci.org/eiurur/Mizu)
[![bitHound Overall Score](https://www.bithound.io/github/eiurur/Mizu/badges/score.svg)](https://www.bithound.io/github/eiurur/Mizu)
[![bitHound Dependencies](https://www.bithound.io/github/eiurur/Mizu/badges/dependencies.svg)](https://www.bithound.io/github/eiurur/Mizu/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/eiurur/Mizu/badges/devDependencies.svg)](https://www.bithound.io/github/eiurur/Mizu/master/dependencies/npm)

> Minna-no-Okazu

Downloader of popular images for the image board.

# Installation

    npm i mizu -S

# Usage

### yande.re

```JavaScript
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
```

### danbooru

```JavaScript
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
```

### SankakuComplex

```JavaScript
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
```

### Amatsuka

TODO

### Output (Example)

```js
const danbooru = Mizu.createCrawler(params);
danbooru.crawl()
.then( _ => danbooru.download() )
.then( illustList => console.log(illustList) )

↓

{  
    title:'2girls apron arched_back arm_up artoria_pendragon_(all) ass bikini black_bikini blonde_hair blush breasts closed_mouth cowboy_shot eyebrows_visible_through_hair fate/grand_order fate_(series) green_eyes hair_between_eyes hair_intakes highres hood hooded_jacket hoodie jacket light_brown_hair long_hair long_sleeves looking_at_viewer maid_headdress medium_breasts mop multiple_girls nail_polish nero_claudius_(swimsuit_caster)_(fate) open_clothes open_hoodie open_jacket saber_alter saber_extra side-tie_bikini sideboob simple_background smile striped striped_bikini swimsuit sword twintails v waist_apron weapon white_background yang-do yellow_eyes',
    sourceURL:'https://danbooru.donmai.us/posts/2817083',
    largeImgURL:'https://danbooru.donmai.us/data/__artoria_pendragon_nero_claudius_saber_alter_and_saber_extra_fate_grand_order_and_fate_series_drawn_by_yang_do__c149cb7a38ae80e42db0a05d4fe261cc.jpg',
    mediumImgURL:'https://danbooru.donmai.us/data/sample/__artoria_pendragon_nero_claudius_saber_alter_and_saber_extra_fate_grand_order_and_fate_series_drawn_by_yang_do__sample-c149cb7a38ae80e42db0a05d4fe261cc.jpg',
    url:'https://danbooru.donmai.us/data/sample/__artoria_pendragon_nero_claudius_saber_alter_and_saber_extra_fate_grand_order_and_fate_series_drawn_by_yang_do__sample-c149cb7a38ae80e42db0a05d4fe261cc.jpg',
    ext:'.jpg'
},
{  
    title:'1girl alexmaster arm_support bangs beach bikini blonde_hair blue_eyes blush breasts closed_mouth collarbone day eyebrows_visible_through_hair frown groin hair_ribbon leaning_back long_hair looking_at_viewer navel original outdoors palm_tree partially_visible_vulva pink_bikini red_ribbon ribbon shiny shiny_skin small_breasts spread_legs stomach sweat swimsuit thighs towel tree twintails umbrella wavy_mouth',
    sourceURL:'https://danbooru.donmai.us/posts/2816002',
    largeImgURL:'https://danbooru.donmai.us/data/__original_drawn_by_alexmaster__f53ddbc12565036e0ce803419c079696.jpg',
    mediumImgURL:'https://danbooru.donmai.us/data/__original_drawn_by_alexmaster__f53ddbc12565036e0ce803419c079696.jpg',
    url:'https://danbooru.donmai.us/data/__original_drawn_by_alexmaster__f53ddbc12565036e0ce803419c079696.jpg',
    ext:'.jpg'
},
```

# Support

* [x] danbooru
* [x] SankakuComplex
* [x] yande.re
* [x] <a href="https://amatsuka.herokuapp.com" target="_blank">Amatsuka</a>
