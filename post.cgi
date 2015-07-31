#!/usr/bin/node
var fs = require('fs');

process.stdin.setEncoding('utf8');

var data = [];
process.stdin.on('readable', function() {
  process.stderr.write("reading\n");
  var chunk = process.stdin.read();
  if (chunk !== null) process.stderr.write(chunk);
  if (chunk !== null) data.push(chunk);
});

function toFileName(string) {
  return string.toLowerCase().replace(/\W+/g, '-');
}

process.stdin.on('end', function() {
  process.stderr.write("end\n");
  var request = JSON.parse(data.join(''));
  if (!request.dance || !request.figure || !request.steps) return;
  var filename = 'data/' + toFileName(request.dance) + '/' +
    toFileName(request.figure) + '.json';
  fs.writeFile(filename, JSON.stringify(request.steps, null, 2));
  process.stdout.write("Content-type: text/plan\r\n\r\n" + filename);
});
