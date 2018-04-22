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
    if(myPort)
      myPort.write(data.cmd);
    else {
      // console.warn('Arduino is not connected! Command failed to send.');
      socket.broadcast.emit('err', {msg: 'CarrotCane is not connected to the server!'});
    }
  })

  socket.on('coordinates', function(data) {
    console.log(data.lat + ', ' + data.long);
    socket.broadcast.emit('coordTransfer', data);
  });

  if(myPort) {
    myPort.on('data', (data) => {
      /* get a buffer of data from the serial port */
      console.log(data.toString());
    });
  }
  else {
    console.warn('Arduino is not connected!');
    socket.broadcast.emit('err', { msg: 'CarrotCane is not connected to the server! Please connect and refresh the page.' });
  }
});

var serverPort = process.env.PORT || config.port;
http.listen(serverPort, function() {
  console.log("Starting http server on port: " + serverPort);
});

console.log('Server has started');