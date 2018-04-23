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
    if (socket.connected == false) {
        var errConfirm = confirm("FATAL: Socket Connection To Server Failed. CarrotCane Will Not Run Correctly. Exit Application?");
        if (errConfirm == true) {
            window.close();
        } else {
            alert("DEBUG: Please check console messages for errors.");
        }
    }
    var coords = document.getElementById('coords');
    socket.on('coordTransfer', function(data) {
       
        coords.innerHTML = 'Current Coordinates: ' + data.lat + ', ' + data.long;
    });
}