(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var socket;
var global = require('./global.js');

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

};

window.onload = function() {
    'use strict';
    
    var btn1 = document.getElementById('1');
    btn1.onclick = buttonClick(btn1.id);
    connect();
};

function buttonClick(id) {
    console.log('click');
    if(id === 1) {
        console.log(1);
        this.socket.emit('command', {cmd: 'LED0ON'});
    }
}

function SetupSocket(socket) {
    //Debug
    console.log('Socket:',socket);

}
},{"./global.js":2}],2:[function(require,module,exports){
module.exports = {
    BAUD_RATE: 9600,
    SERVER_IP: 'https://hackerware.herokuapp.com',
    LOCAL_HOST: 'localhost:3000',
};

},{}]},{},[1]);