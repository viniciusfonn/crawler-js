var Crawler = require("js-crawler");

var crawler = new Crawler().configure({
    depth: 3,
    shouldCrawl: function (url) {
        return url.indexOf("fapergs.rs.gov.br") > 0;
    },
    shouldCrawlLinksFrom: function (url) {
        return url.indexOf("fapergs.rs.gov.br") > 0;
    }
});

var editais = [];
var arquivos = [];

crawler.crawl(
    "https://fapergs.rs.gov.br/mapa-do-site",
    function onSuccess(page) {
        if (page.url.indexOf("/edital-") > 0) {
            editais.push(page.url);
           
        }
        if (page.url.indexOf(".pdf".toLowerCase()) > 0) {
            arquivos.push({url: page.url.toLowerCase(), ref: page.referer});
           
        }



    },
    null,

    function onAllFinished(page, url) {
        console.log('All crawling finished');

        arquivos.map(item => {
         
            if(item.url.indexOf(".pdf".toLowerCase()) && item.ref.indexOf("/edital-" ) >0) {
            console.log("alo");
            const https = require('https');
            const fs = require('fs');

            if (!fs.existsSync("./editais/" + item.ref.slice(26))) {
                fs.mkdirSync("./editais/" + item.ref.slice(26));
            } else {
                console.log("ja existe " + item.ref.slice(26))
            }

            const file = fs.createWriteStream("./editais/" + item.ref.slice(26) + "/" + item.url.slice(58));
            const request = https.get(page.url, function (response) {
                response.pipe(file);

            });


        

        };



    })

    });
