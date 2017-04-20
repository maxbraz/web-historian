var archive = require('/Users/student/code/hrsf76-web-historian/helpers/archive-helpers.js');
var fs = require('fs');
var path = require('path');

console.log('** download **');

archive.readListOfUrls((allUrls) => {
  allUrls.forEach((url) => {
    archive.isUrlArchived(url, (isArchived) => {
      if (!isArchived) {
        archive.downloadUrls([url]);

        fs.readFile('/Users/student/code/hrsf76-web-historian/workers/downloadURLs.log', 'utf-8', (err, data) => {
          if (!err) {
            data = data + url + '\n';
            fs.writeFile('/Users/student/code/hrsf76-web-historian/workers/downloadURLs.log', data, () => {
              console.log('downloaded URL');
            });
          }
        });

      }
    });
  });
});