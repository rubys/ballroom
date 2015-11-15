#!/usr/bin/env node

//
// A simple script, runnable as a CGI script that will process requests to
// post a figure.
//

var fs = require('fs');

// utility function: convert arbitrary strings to file names
function toFileName(string) {
  return string.toLowerCase().replace(/\W+/g, '-');
}

function post(stream, output) {
  // collect JSON data from stream
  var data = [];
  stream.on('data', function(chunk) {
    if (chunk !== null) data.push(chunk);
  });

  // parse, save figure
  stream.on('end', function() {
    // parse, validate request
    var request = JSON.parse(data.join(''));
    var fileName = null;
    if (request.dance && request.figure && request.steps) {
      fileName = toFileName(request.figure) + '.json';

      // write out figure
      var fullName = 'data/' + toFileName(request.dance) + '/' + fileName;
      if (fs.existsSync(fullName)) fs.unlinkSync(fullName);
      fs.writeFileSync(fullName, JSON.stringify(request.steps, null, 2) + "\n");

      // update index
      var indexName = 'data/' + toFileName(request.dance) + '/index.json';
      var index = JSON.parse(fs.readFileSync(indexName, 'utf8'));
      for (var i=0; i<index.figures.length; i++) {
        if (index.figures[i].name == request.figure) {
          index.figures[i].file = fileName;
          break;
        }
      }
      if (i >= index.figures.length) {
        index.figures.push({name: request.figure, file: fileName});
      }

      // write out index
      fs.unlinkSync(indexName);
      fs.writeFileSync(indexName, JSON.stringify(index, null, 2).
        replace(/[^\x00-\x7F]/g, function(c) {
          return '\\u' + ('000' + c.charCodeAt().toString(16)).slice(-4)}).
        replace(/(\n\s{0,4}\},)/g, "$1\n") + "\n");
     }

    // produce response
    output(fileName);
  });
};

if (require.main === module && process.env.REQUEST_METHOD == 'POST') {

  // if running as a CGI, process stdin
  process.stdin.setEncoding('utf8');
  post(process.stdin, function(fileName) {
    process.stdout.write("Content-type: text/plan\r\n\r\n" + fileName);
  });

} else {

  // otherwise export post function
  module.exports.post = post;

}
