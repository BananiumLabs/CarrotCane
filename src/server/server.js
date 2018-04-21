var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var SerialPort = require('serialport');
var global = require('../client/js/global.js');

var config  = require('./config.json');

app.use(express.static(__dirname + '/../client'));

var myPort;

// Auto connect to the right serial port
SerialPort.list(function (err, ports) {
  ports.forEach(function (port) {
    if (port.manufacturer.indexOf("duino") != -1) {
      myPort = new SerialPort(port.comName, {
        baudRate: global.BAUD_RATE
      });
      console.log("Port found: " + port.comName);
    }
  });
});

io.on('connection', function (socket) {

  //Do stuff here
  socket.on('command', function(data) {
    console.log(socket.id + ' sent command ' + data.cmd);
    myPort.write(data.cmd);
  })
});

var serverPort = process.env.PORT || config.port;
http.listen(serverPort, function() {
  console.log("Starting http server on port: " + serverPort);
});

console.log('Server has started');