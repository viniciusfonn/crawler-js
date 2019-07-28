const Crawler = require("js-crawler");

const https = require('https');
const fs = require('fs');

const arquivos = [];

const crawler = new Crawler().configure({
    depth: 3,
    shouldCrawl: url=> url.indexOf("fapergs.rs.gov.br") > 0
    
});

crawler.crawl(
    "https://fapergs.rs.gov.br/mapa-do-site",
    function onSuccess(page) {
     
        if (page.url.toLowerCase().indexOf(".pdf") > 0) {
            arquivos.push({ url: page.url, ref: page.referer });
        }

    },
    null,

    function onAllFinished(page) {

        if (!fs.existsSync("./editais/")) {
            fs.mkdirSync("./editais/");
        }

        arquivos.map(item => {

            if (item.url.indexOf(".pdf") && item.ref.indexOf("/edital-") > 0) {

                if (!fs.existsSync(`./editais/${item.ref.slice(26)}`)) {
                    fs.mkdirSync(`./editais/${item.ref.slice(26)}`);
                }

                const file = fs.createWriteStream(`./editais/${item.ref.slice(26)}/${item.url.slice(58)}`);
               if (!item.url.indexOf("127.0.0.1") > 0) {
                https.get(page.url, response => response.pipe(file)).on("error", err => console.log(`Error: ${err.message}`));
            }
              
            };

        })

    });
