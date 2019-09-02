const fs = require('fs');
const path = require('path');
const extract = require('pdf-text-extract');
const axios = require('axios');


export default function leitura(arquivos) {
    arquivos.map(item => {
        if (item != false) {


            const filePath = path.join(__dirname, `./editais/${item.ref.slice(26)}/${item.url.slice(58)}`)
            extract(filePath, function (err, pages) {
                if (err) {
                    axios.post('http://localhost:3333/api/errors', {
                        error: err
                    });
                    return
                }
                else {
                    axios.post('http://localhost:3333/api/file', {
                        pagina: pages
                    });

                    pages.map((pag, index) => {
                        fs.writeFile(`./editais/${item.ref.slice(26)}/${item.url.slice(58, -3)}${index + 1}.txt`, pag, function (erro) {
                            if (erro) {
                                throw erro;
                            }
                        });

                    }
                    )
                };
            })
        }
    });
};