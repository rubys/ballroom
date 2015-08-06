#!/usr/bin/node
var fs = require('fs');

process.stdin.setEncoding('utf8');

var data = [];
process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) data.push(chunk);
});

function toFileName(string) {
  return string.toLowerCase().replace(/\W+/g, '-');
}

process.stdin.on('end', function() {
  var request = JSON.parse(data.join(''));
  if (!request.dance || !request.figure || !request.steps) return;
  var fileName = 'data/' + toFileName(request.dance) + '/' +
    toFileName(request.figure) + '.json';
  fs.writeFile(fileName, JSON.stringify(request.steps, null, 2));
  process.stdout.write("Content-type: text/plan\r\n\r\n" + fileName);

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
  fs.writeFile(indexName, JSON.stringify(index, null, 2).
    replace(/(\n\s{0,4}\},)/g, "$1\n"));
});
