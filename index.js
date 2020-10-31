const fs = require('fs');
const http = require('http');
const url = require('url');
const PORT = process.env.PORT || 8000;
const replaceTemplate = require('./modules/replace-template');
/*
const textIn = fs.readFileSync('./txt/input.txt' , 'utf-8');
console.log(textIn);

const textOut = `this is the new line that i am adding ${textIn}.\n This is already written stuff , ${Date.now()}`;
fs.writeFileSync('./txt/output.txt' , textOut);
console.log("Text is written");
*/
/////////////////////////////////////////////
//SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html` , 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html` , 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html` , 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json` , 'utf-8');
const dataObj = JSON.parse(data);


//Overview-Page
const server = http.createServer((req , res) =>{
    const {query , pathname} = url.parse(req.url , true);

    //const pathName = req.url;
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200 , {'Content-type' : 'text/html'});
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard , el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}' , cardHtml);
        res.end(output);
        //console.log(cardHtml);
        //res.end(tempOverview);
    }
//product-page
    else if(pathname === '/product'){
        res.writeHead(200 , {'Content-type' : 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct , product);
        res.end(output);
    }
//API    
    else if(pathname === '/api'){
        res.writeHead(200 , {'Content-type' : 'application/json'});
        res.end(data);
    }
//Not-found    
    else{
        res.writeHead(404 , {
            'Content-type' : 'text/html'
        });
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(PORT , '127.0.0.1' , () => {
    console.log('Listening to the request from the port 8000');
});