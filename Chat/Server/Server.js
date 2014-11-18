/**
 * Created by alisio on 8/11/2014.
 */
var net = require('net');
var path = require('path');
var express = require('express');
//var io = require('socket.io');
var app = express();
var http = require('http').createServer(app);
app.use(express.static(path.join(__dirname, '../')));
http.listen(80);
var server = net.Server();
var ip = 'localhost';
var port = 6600;
server.listen(port, ip);

server.on('connection', function (socket) {
    socket.write('yooo client');

    socket.on('data', function (data) {
        console.log('data from client: ' + data);
    });
});

//client
setTimeout(function () {
    var connection = net.connect(port, ip, function () {
        connection.write('Hi server');

        setInterval(function () {
            connection.write('ping');
        }, 1000 * 2);

        connection.on('data', function (data) {
            console.log('data from the server: ' + data);
        });
    });
}, 1000 * 2)