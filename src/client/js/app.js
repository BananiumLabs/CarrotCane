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
    var btn2 = document.getElementById('2');
    btn1.onclick = function() {sendCommand('LED0ON')};
    btn2.onclick = function() {sendCommand('LED0OFF')};
    connect();
};

function sendCommand(cmd) {
        socket.emit('command', {cmd: cmd + '\n'});
}

function SetupSocket(socket) {
    //Debug
    console.log('Socket:',socket);

}