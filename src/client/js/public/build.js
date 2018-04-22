(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var socket;
var global = require('./global.js');
// var demo = require('./lib/demo.js');
var isConnected = true;

//Get screen dimensions
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

function connect() {

    //Production
    // socket = io.connect(global.SERVER_IP);

    //Debugging and Local serving
    if(!socket) {
        console.log('Failed to connect, falling back to localhost');
        socket = io.connect(global.LOCAL_HOST);
    }
    
    if(socket !== null)
        SetupSocket(socket);
    
    socket.on('err', function(data) {
        isConnected = false;
    });

};

window.onload = function() {
    'use strict';
    
    var btn1 = document.getElementById('1');
    var btn2 = document.getElementById('2');
    var btn3 = document.getElementById('3');
    var btn4 = document.getElementById('4');
    btn1.onclick = function() {sendCommand('LED0ON')};
    btn2.onclick = function() {sendCommand('LED0OFF')};
    btn3.onclick = function() {sendCommand('PAUSE')};
    btn4.onclick = function() {sendCommand('START')};
    connect();
};

function sendCommand(cmd) {
        socket.emit('command', {cmd: cmd + '\n'});
}

function SetupSocket(socket) {
    //Debug
    console.log('Socket:',socket);

    var coords = document.getElementById('coords');
    socket.on('coordTransfer', function(data) {
       
        coords.innerHTML = 'Current Coordinates: ' + data.lat + ', ' + data.long;
    });
}
},{"./global.js":2}],2:[function(require,module,exports){
module.exports = {
    BAUD_RATE: 9600,
    SERVER_IP: 'https://hackerware.herokuapp.com',
    LOCAL_HOST: 'localhost:3000',
};

},{}]},{},[1]);
