var Crawler = require("js-crawler");
 
var crawler = new Crawler().configure({
    depth: 2,
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
    },
    null,
    function onAllFinished(crawledUrls) {
        console.log('All crawling finished');
        console.log(editais);
 
        editais.map(item => {
 
            var crawler2 = new Crawler().configure({
                depth: 2,
                shouldCrawl: function (url) {
                    return url.indexOf("fapergs.rs.gov.br") > 0;
                },
                shouldCrawlLinksFrom: function (url) {
                    return url.indexOf("fapergs.rs.gov.br") > 0;
                }
            });
 
            crawler2.crawl(
                item,
                function onSuccess(page, url) {
                    if (page.url.indexOf(".pdf") > 0) {
                        arquivos.push(page.url);
 
                        const https = require('https');
                        const fs = require('fs');
 
                        if (!fs.existsSync("./editais/" + item.slice(26))) {
                            fs.mkdirSync("./editais/" + item.slice(26));
                        }  else {
                        console.log("ja existe " + item.slice(26))
                        }
                       
                        const file = fs.createWriteStream("./editais/" + item.slice(26) + "/" + page.url.slice(49));
                        const request = https.get(page.url, function (response) {
                            response.pipe(file);
                       
                        });
 
                    }
                },
                null,
                function onAllFinished(crawledUrls) {
                    
                });
 
        })
 
    }
 
)
 
 

 
 
