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
  if (fs.existsSync(fileName)) fs.unlinkSync(fileName);
  fs.writeFileSync(fileName, JSON.stringify(request.steps, null, 2) + "\n");

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
  fs.unlinkSync(indexName);
  fs.writeFileSync(indexName, JSON.stringify(index, null, 2).
    replace(/(\n\s{0,4}\},)/g, "$1\n") + "\n");

  process.stdout.write("Content-type: text/plan\r\n\r\n" + fileName);
});
