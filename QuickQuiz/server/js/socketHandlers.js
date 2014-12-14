/**
 * Created by alisio on 22/11/2014.
 */
var domain = require("domain");
var player = require("./player.js");
var serverQuiz = require("./serverQuiz.js");
//var users = [];

var getHandlers = function (httpServer) {
    var socketDomain = domain.create();
    socketDomain.on('error', function (err) {
        console.log('Error caught in socket domain:' + err);
    });

    socketDomain.run(function () {
        var io = require('socket.io').listen(httpServer);
        io.sockets.on('connection', function (socket) {
            var address = socket.handshake.address;
            //console.log("sockets connection established " + address.address+":"+address.port);
            console.log("sockets connection established " + socket.request.connection.remoteAddress);

            //id, ip, name, img, registered, admin
            var id = serverQuiz.players.length;
            player.init(id, address, null, null, false, false);
            serverQuiz.addUser(player);
            socket.emit('serverGiveNumberUsers', serverQuiz.players.length);
            socket.emit('serverClientId', id);
            socket.broadcast.emit('serverGiveNumberUsers', serverQuiz.players.length);
            retrievedMessage(socket);
        });
    });
};

function retrievedMessage(socket) {
    socket.on('clientMessage', function (content) {
        //emit laat toe een json object te sturen
        var obj = {color: socket.color, id: socket.id, content: content}
        socket.emit('serverMessage', JSON.stringify(obj)); //naar zichzelf
        socket.broadcast.emit('serverMessage', JSON.stringify(obj)); // naar andere clients only
    });

    socket.on('clientGetNumberUsers', function (content) {
        socket.emit('serverGiveNumberUsers', serverQuiz.players.length);
    });

    socket.on('clientRegisterMessage', function (content) {
        var res = content.split(":");
        createUserInDatabase(socket, res[0], res[1], res[2]);
    });

    socket.on('clientLoginMessage', function (content) {
        var res = content.split(":");
        checkUserExistsInDatabase(socket, res[0], res[1], res[2]);
    });
}

function createUserInDatabase(socket, id, name, pass) {
    var address = socket.handshake.address;
    //create user database

    player.init(id, address, name, null, true, false);
    serverQuiz.replaceUnregisteredPlayerWithRegisteredPlayerById(id, player);
    socket.emit('serverRegisterMessage', true + ":" + name + ":" + true);
}

function checkUserExistsInDatabase(socket, id, name, pass) {
    var address = socket.handshake.address;
    //check if user exists

    player.init(id, address, name, null, true, false);
    serverQuiz.replaceUnregisteredPlayerWithRegisteredPlayerById(id, player);
    socket.emit('serverLoginMessage', true + ":" + name + ":" + true);
}

module.exports.getHandlers = getHandlers;