"use strict"
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
var request = require('request');
var cheerio  = require('cheerio');
const rp = require('request-promise');
var psl = require('psl');
var urllib = require('url');
var urlExists = require('url-exists');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handle / route
router.post('/scrape', (req, res) => {
    let url = req.body.url;
    rp({url, resolveWithFullResponse: true})
    .then(function(response){
        var htmlVersion = "";
        let hostname = urllib.parse(url).hostname.replace('www.','');
        let html = response.body;
        var $ = cheerio.load(html);

        var docType = html.split("<html");
        if(docType.length > 0){
            var htmlType = docType[0].replace(/^\s+|\s+$/g, '');;
            var htmlMatch = htmlType.match("//DTD (.*)//EN");
            
            if (htmlType === '<!DOCTYPE html>' || htmlType === '<!doctype html>') {
                htmlVersion = "HTML 5";
            }
            else if (htmlMatch != null && htmlMatch.length > 0) {
                htmlVersion = htmlMatch[1];
            }
            else{
                htmlVersion = "unknown";
            }
        }

        var title = $('title').text();

        var isLoginForm = 0;
        var internalLinks = 0;
        var externalLinks = 0;
        var inaccessibleLinks = 0;

        var h1Tag = $('h1').length;
        var h2Tag = $('h2').length;
        var h3Tag = $('h3').length;
        var h4Tag = $('h4').length;
        var h5Tag = $('h5').length;
        var h6Tag = $('h6').length;

        var links = [];
        let linkUrl;
        let linkhost;

        if($('input[type="password"]').length == 1){
            isLoginForm = 1;
        }

        $('a').each(function (i, elem) {
            links.push({});

            linkUrl = $(this).attr('href');
            if(linkUrl != undefined){

                if(linkUrl.startsWith("http")){
                    linkhost = urllib.parse(linkUrl).hostname.replace('www.','');
                }
                else{
                    linkhost = "";
                }

                if(linkUrl.startsWith("http")){
                    urlExists(linkUrl, function(err, exists) {
                        if(!exists){
                            inaccessibleLinks++;
                        }
                    });
                }
                else{
                    
                }

                if(linkhost === hostname){
                    internalLinks++;
                    links[i].type = "internal";
                }
                else{
                    if(!linkUrl.startsWith("http")){
                        internalLinks++;
                        links[i].type = "internal";
                    }
                    else{
                        externalLinks++;
                        links[i].type = "external";
                    }
                }
                links[i].link = linkUrl;
            }
        });

        
        var totalLinks = internalLinks + externalLinks;
        //var internalLinks = $("a[href^='/']", html).length + $("a[href^='./']", html).length;

        var headings = [];
        headings.push({type: "H1", value: h1Tag});
        headings.push({type: "H2", value: h2Tag});
        headings.push({type: "H3", value: h3Tag});
        headings.push({type: "H4", value: h4Tag});
        headings.push({type: "H5", value: h5Tag});
        headings.push({type: "H6", value: h6Tag});

        let result = { title: title, htmlVersion: htmlVersion, isLoginForm: isLoginForm, totalLinks: totalLinks, internalLinks: internalLinks, externalLinks: externalLinks, inaccessibleLinks: inaccessibleLinks, headings: headings};

        return res.json({ status: true,  statusCode: response.statusCode, data: result});
        
    })
    .catch(function(err){
        return res.json({ status: false, statusCode: err.response.statusCode, statusMessage: err.response.statusMessage   });
    });
})


// append /api for our http requests
app.use('/api', router);
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));