#!/usr/bin/env node

//
// A simple web server that responds with static HTML, CSS, and JS files,
// and responds to requests to post a figure.
//

var http = require('http');
var fs = require('fs');
var post = require('./post.cgi').post;

var quiet = false;
var port = 8888;

for (var i=2; i<process.argv.length; i++) {
  if (process.argv[i] == '-q') {
    quiet = true;
  } else if (/^\d+$/.test(process.argv[i])) {
    port = parseInt(process.argv[i]);
  } else {
    console.log('Usage: ' + process.argv[0] + ' ' + process.argv[1] + 
      ' [-q] [port]');
    process.exit();
  }
}

var server = http.createServer(function(request, response) {
  if (request.method == 'POST') {
    post(request, function(fileName) {
      if (fileName) {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end("file name: " + filename);
      } else {
        response.writeHead(322, {});
        response.end('');
      }
    });
  } else {
    var fileName = '.' + request.url;
    if (fileName == './') fileName = './index.html';
    if (fileName.indexOf('..') != -1) fileName = './error';

    fs.readFile(fileName, function(error, content) {
      if (error) {
        response.writeHead(404);
        response.end();
        if (!quiet) console.log("404 " + fileName.substr(1));
      } else {
        if (/\.html$/.test(fileName)) {
          response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        } else if (/\.css$/.test(fileName)) {
          response.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'});
        } else if (/\.js$/.test(fileName)) {
          response.writeHead(200, {'Content-Type': 'application/js'});
        } else {
          response.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
        }

        response.end(content, 'utf-8');
        if (!quiet) console.log("200 " + fileName.substr(1));
      }
    });
  }
});

if (!quiet) console.log("Listing on port " + port);
server.listen(port);
