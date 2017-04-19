var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // res.end(archive.paths.list);

  if (req.method === 'GET') {
    console.log(req.method, req.url);
    if (req.url === '/') {
      req.url = '/index.html';
    }
    helpers.serveAssets(res, archive.paths.siteAssets + req.url, function (data) {
      res.writeHead(200, helpers.headers);
      res.end(data);
    });
  } else {
    // res.end();
  }

  if (req.method === 'POST') {
    var body = '';

    req.on('data', function (data) {
      body += data;
    });

    req.on('end', function (data) {
      
      archive.addUrlToList(body.split('=')[1], function() {
        res.writeHead(302, helpers.headers);
        res.end(data);       
      });
    });
  }

};
