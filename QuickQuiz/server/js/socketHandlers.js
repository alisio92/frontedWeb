/**
 * Created by alisio on 22/11/2014.
 */
var domain = require("domain");
var player = require("./player.js");
var serverQuiz = require("./serverQuiz.js");
var game = require("./game.js");

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

            var id = serverQuiz.players.length;
            player.init(id, address, null, null, false, false);
            if(!serverQuiz.checkIfExists(player)) serverQuiz.addUser(id, player);
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
    socket.on('clientCreateGameMessage', function (content) {
        var res = content.split(":");
        createGame(socket, res[0], res[1]);
    });
    socket.on('clientQueuesMessage', function (content) {
        getQueues(socket);
    });
    socket.on('clientJoinGameMessage', function (content) {
        var res = content.split(":");
        joinQueue(socket, res[0], res[1]);
    });
}

function joinQueue(socket, id, instance){
    var player = serverQuiz.getPlayer(id);
    if(!serverQuiz.checkIfPlayerIsPlaying(player)) {
        joinPlayerToGame(player, instance);
    }
    var message = "";
    for(i = 0;i < serverQuiz.games.length;i++){
        message+= i + ":" + serverQuiz.games[i].players.length + ":" + serverQuiz.games[i].amount + ";";
    }
    socket.broadcast.emit('serverQueuesMessage', message);
    socket.emit('serverQueuesMessage', message);
}

function getQueues(socket){
    var message = "";
    for(i = 0;i < serverQuiz.games.length;i++){
        message+= i + ":" + serverQuiz.games[i].players.length + ":" + serverQuiz.games[i].amount + ";";
    }
    socket.emit('serverQueuesInitiatedMessage', message);
}

function createGame(socket, id, amount){
    var player = serverQuiz.getPlayer(id);
    if(!serverQuiz.checkIfPlayerIsPlaying(player)){
        var gameInit = game.init(player, amount);
        if(gameInit) {
            serverQuiz.addGame(game);
            serverQuiz.addPlayerPlaying(player);
        }
    }
    var message = "";
    for(i = 0;i < serverQuiz.games.length;i++){
        message+= i + ":" + serverQuiz.games[i].players.length + ":" + serverQuiz.games[i].amount + ";";
    }
    socket.broadcast.emit('serverQueuesMessage', message);
    socket.emit('serverQueuesMessage', message);
}

function createUserInDatabase(socket, id, name, pass) {
    var address = socket.handshake.address;
    //create user database
    var admin = false;
    player.init(id, address, name, null, true, false);
    serverQuiz.replaceUnregisteredPlayerWithRegisteredPlayerById(id, player);
    socket.emit('serverRegisterMessage', true + ":" + name + ":" + admin);
}

function checkUserExistsInDatabase(socket, id, name, pass) {
    var address = socket.handshake.address;
    //check if user exists
    var admin = true;

    player.init(id, address, name, null, true, false);
    serverQuiz.replaceUnregisteredPlayerWithRegisteredPlayerById(id, player);
    socket.emit('serverLoginMessage', true + ":" + name + ":" + admin);
}

module.exports.getHandlers = getHandlers;