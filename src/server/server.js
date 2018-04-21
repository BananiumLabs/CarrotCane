var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

var config  = require('./config.json');

app.use(express.static(__dirname + '/../client'));

io.on('connection', function (socket) {
  
  //Do stuff here
});

var serverPort = process.env.PORT || config.port;
http.listen(serverPort, function() {
  console.log("Starting http server on port: " + serverPort);
});

console.log('Server has started');