#!/usr/bin/node
var fs = require('fs');

// utility function: convert arbitrary strings to file names
function toFileName(string) {
  return string.toLowerCase().replace(/\W+/g, '-');
}

// collect stdin
var data = [];
process.stdin.setEncoding('utf8');
process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) data.push(chunk);
});

process.stdin.on('end', function() {
  // parse, validate request
  var request = JSON.parse(data.join(''));
  if (!request.dance || !request.figure || !request.steps) return;

  // write out figure
  var fileName = 'data/' + toFileName(request.dance) + '/' +
    toFileName(request.figure) + '.json';
  if (fs.existsSync(fileName)) fs.unlinkSync(fileName);
  fs.writeFileSync(fileName, JSON.stringify(request.steps, null, 2) + "\n");

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

  // produce response
  process.stdout.write("Content-type: text/plan\r\n\r\n" + fileName);
});
