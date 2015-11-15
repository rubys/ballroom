#!/usr/bin/env node

//
// A simple web server that responds with static HTML, CSS, and JS files,
// and responds to requests to post a figure.
//

var http = require('http');
var fs = require('fs');
var post = require('./post.cgi').post;

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
      }
    });
  }
});

server.listen(parseInt(process.argv[2] || 8888));
