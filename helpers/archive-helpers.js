var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = (callback) => {

  fs.readFile(exports.paths.list, 'utf-8', (err, data) => {
    if (err) {
      res.end();
    }
    data = (data === '') ? [] : data.split('\n');
    callback(data);
  });

};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((urlArray) => {
    (urlArray.indexOf(url) >= 0) ? callback(true) : callback(false); 
  });
};

exports.addUrlToList = function(url, callback) {
  exports.readListOfUrls((urlArray) => {
    urlArray.push(url);
    fs.writeFile(exports.paths.list, urlArray.join('\n'), callback);
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    if (!err) {
      (files.indexOf(url) >= 0) ? callback(true) : callback(false);
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(url => {
    // retrieve data/
    // save data to folder
    request('http://' + url, function(err, res, body) {
      fs.writeFile(exports.paths.archivedSites + '/' + url, body, () =>{
        console.log('download Url successful');
      });
    });
  });
};
