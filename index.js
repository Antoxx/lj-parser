var util = require('util');
var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var pdf = require('html-pdf');
var yaml = require('js-yaml');
var yaml = require('yamljs');
var fs = require('fs');
var dir = '/home/anton/Dropbox/33/N/lj-parser/';
var linksFileName = '../lj-links/Links.yml';
var linksFileName = 'links.yml';

var linksFilePath = dir + linksFileName;
var linksFilePath = linksFileName;

var pdfOpts = {
    'format': 'A4'
};

var parse = function (userHome, linkId, linkTitle, linkUrl, callback) {
    request(linkUrl, function (err, res, body) {
        if (err) {
            console.log('Error on page: ' + linkUrl);
        } else {
            var $ = cheerio.load(body);
            var title = $('h1.entry-title').text().trim();

            if (!linkTitle) {
                users[userHome][linkId] = title;
            }


//                var html = $('div.asset-inner').html();
    //        console.log(html);

//                html = '<html><body>' + html + '</body></html>';
//
//                pdf.create(html, pdfOpts).toFile(filename, function (err, res) {
//                    console.log(res.filename);
//                });

            callback();
        }
    });
};

var yamlString = fs.readFileSync(linksFilePath).toString();
var users = yaml.parse(yamlString);
var userLinks, userHome, linkTitle, linkId, linkUrl;
var funcs = [];
for (userHome in users) {
    userLinks = users[userHome];

    for (linkId in userLinks) {
        linkTitle = userLinks[linkId];
        linkUrl = userHome + linkId + '.html';

        funcs.push(parse.bind(this, userHome, linkId, linkTitle, linkUrl));
    }
}

async.parallel(funcs, function () {
    fs.writeFileSync(linksFilePath, yaml.stringify(users, 4));
});

