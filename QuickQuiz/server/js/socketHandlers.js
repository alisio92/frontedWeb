/**
 * Created by alisio on 22/11/2014.
 */
var domain = require("domain");
var player = require("./player.js");
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
            var id = player.players.length;
            p = new player.init(socket, id, address, null, null, false, false);
            player.addUser(p);
            socket.emit('serverClientId', id);
            socket.emit('serverGiveNumberUsers', player.players.length);
            socket.broadcast.emit('serverGiveNumberUsers', player.players.length);
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
    socket.on('clientReadyMessage', function (content) {
        var res = content.split(":");
        addToReady(socket, res[0], res[1]);
    });
}
function addToReady(socket, id, instance){
    var p = player.getPlayer(id);
    var playerQueued = game.checkPlayerIsQueued(instance, p);
    if(playerQueued){
        game.addPlayerToReady(instance, p);
    }
    var everyoneReady = game.checkEveryoneReady(instance);
    if(everyoneReady){
        getQuestion(instance);
    }
}
function joinQueue(socket, id, instance){
    var p = player.getPlayer(id);
    if(!game.checkIfPlayerIsPlaying(p)) {
        game.joinPlayerToGame(p, instance);
        game.addPlayerPlaying(p);
    }
    var message = "";
    for(i = 0;i < game.games.length;i++){
        message+= i + ":" + game.games[i].players.length + ":" + game.games[i].amount + ";";
    }
    socket.broadcast.emit('serverQueuesMessage', message);
    socket.emit('serverQueuesMessage', message);
    var fullQueue = game.checkIfQueueIsFull(instance);
    if(fullQueue){
        var SocketsPlayers = game.getSocketsPlayers(instance);
        for(i = 0; i < SocketsPlayers.length;i++){
            SocketsPlayers[i].socket.emit('serverQueueIsFullMessage', true);
        }
    }
}

function getQuestion(instance){
    var question = 'http://pcoe.nl/@api/deki/files/6/=Gebouw_1.jpg';
    var answer = "";
    var SocketsPlayers = game.getSocketsPlayers(instance);
    for(i = 0; i < SocketsPlayers.length;i++){
        SocketsPlayers[i].socket.emit('serverQuestionMessage', question + ";" + answer);
    }
}

function getQueues(socket){
    var message = "";
    for(i = 0;i < game.games.length;i++){
        message+= i + ":" + game.games[i].players.length + ":" + game.games[i].amount + ";";
    }
    socket.emit('serverQueuesInitiatedMessage', message);
}

function createGame(socket, id, amount){
    var p = player.getPlayer(id);
    var gameId = -1;
    if(!game.checkIfPlayerIsPlaying(p)){
        var gameInit = new game.init(p, amount);
        if(gameInit) {
            game.addGame(gameInit);
            game.addPlayerPlaying(p);
            gameId = game.getId();
        }
    }
    var message = "";
    for(i = 0;i < game.games.length;i++){
        message+= i + ":" + game.games[i].players.length + ":" + game.games[i].amount + ";";
    }
    socket.broadcast.emit('serverQueuesMessage', message);
    socket.emit('serverQueuesMessage', message);
    socket.emit('serverGameInstanceMessage', gameId);
}

function createUserInDatabase(socket, id, name, pass) {
    var address = socket.handshake.address;
    //create user database
    var admin = false;
    var p = new player.init(socket, id, address, name, null, true, false);
    player.replaceUnregisteredPlayerWithRegisteredPlayer(p);
    socket.emit('serverRegisterMessage', true + ":" + name + ":" + admin);
}

function checkUserExistsInDatabase(socket, id, name, pass) {
    var address = socket.handshake.address;
    //check if user exists
    var admin = true;

    var p = new player.init(socket, id, address, name, null, true, false);
    player.replaceUnregisteredPlayerWithRegisteredPlayer(p);
    socket.emit('serverLoginMessage', true + ":" + name + ":" + admin);
}

module.exports.getHandlers = getHandlers;