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

    archive.isUrlInList(req.url.slice(1), (isInList) => {
      let url = req.url.slice(1);
      
      if (isInList) {
        archive.isUrlArchived(url, (isArchived) => {

          if (isArchived) {
            helpers.serveAssets(res, archive.paths.archivedSites + '/' + url, (data) => {
              res.writeHead(200, helpers.headers);
              res.end(data);
            });
          } else {
            helpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function (loadingData) {
              res.writeHead(200, helpers.headers);
              res.end(loadingData);
            });
          }
        });
      } else { // not in list
        helpers.serveAssets(res, archive.paths.siteAssets + req.url, function (data) {
          res.writeHead(200, helpers.headers);
          res.end(data);
        });
      }
    });

  }

  if (req.method === 'POST') {
    var body = '';

    req.on('data', function (data) {
      body += data;
    });

    req.on('end', function (data) {
      let url = body.split('=')[1];

      if (url !== '') {

        archive.isUrlInList(url, (isInList) => {
  
          if (isInList) {
            archive.isUrlArchived(url, (isArchived) => {

              if (isArchived) {
                helpers.serveAssets(res, archive.paths.archivedSites + '/' + url, (data) => {
                  res.writeHead(200, helpers.headers);
                  res.end(data);
                });
              } else {
                helpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function (loadingData) {
                  res.writeHead(200, helpers.headers);
                  res.end(loadingData);
                });

                // end of isAchived
              }
            });
          } else {  // not in list
            archive.addUrlToList(body.split('=')[1], function () {

              helpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function (data) {
                res.writeHead(302, helpers.headers);
                res.end(data);
              });

            });
          }  // end of not in list
        });
      }

    });  // end of req.on
  }

};
