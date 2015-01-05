/**
 * Created by alisio on 22/11/2014.
 */
var domain = require("domain");
var player = require("./player.js");
var game = require("./game.js");
var user = require("./user.js");
var database = require("./database.js");
var Question = require("./question.js");

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
            p = new player.init(socket, id, address, null, null, false, false, true);
            player.addUser(p);
            socket.emit('serverClientIdName', p.id+ ":" + p.name);
            socket.emit('serverGiveNumberUsers', player.players.length);
            socket.broadcast.emit('serverGiveNumberUsers', player.players.length);
            retrievedMessage(socket);
        });
    });
    setInterval(function () {
        checkIfPlayersAreOnline();
    }, 10000);
    setInterval(function () {
        updateTimer();
    }, 1000);
};
function updateTimer() {
    for (i = 0; i < game.games.length; i++) {
        if (!game.games[i].playing && game.checkEveryoneJoined(i)) {
            if (game.games[i].timer > 0) game.games[i].timer--;
            else game.removeGame(games[i]);
        }
    }
}
function checkIfPlayersAreOnline() {
    var onlinePlayers = [];
    for (row = 0; row < player.players.length; row++) {
        if (typeof player.players[row] !== 'undefined') {
            if (player.players[row].online) onlinePlayers.push(player.players[row]);
            else {
                player.removePlayer(player.players[row]);
                game.removePlayerFromGame(player.players[row]);
            }
        }
    }
    for (i = 0; i < onlinePlayers.length; i++) {
        var socket = onlinePlayers[i].socket;
        socket.emit('serverOnline', true);
        var p = player.getPlayerById(onlinePlayers[i].id);
        if (typeof player.players[p.id] !== 'undefined') {
            player.players[p.id].online = false;
        }
    }
    socket.broadcast.emit('serverGiveNumberUsers', player.players.length);
}
function retrievedMessage(socket) {
    socket.on('clientMessage', function (content) {
        //emit laat toe een json object te sturen
        var obj = {color: socket.color, id: socket.id, content: content}
        socket.emit('serverMessage', JSON.stringify(obj)); //naar zichzelf
        socket.broadcast.emit('serverMessage', JSON.stringify(obj)); // naar andere clients only
    });
    socket.on('clientOnline', function (content) {
        if(content >= 0){
            var index = player.getID(content);
            if(typeof player.players[index] !== 'undefined') {
                player.players[index].online = true;
            }
        }
    });
    socket.on('clientInsertMessage', function (content) {
        var res = content.split(":");
        insert(socket, res[0], res[1], res[2], res[3], res[4], res[5], res[6]);
    });
    socket.on('clientGetNumberUsers', function (content) {
        socket.emit('serverGiveNumberUsers', serverQuiz.players.length);
    });
    socket.on('clientRegisterMessage', function (content) {
        var res = content.split(":");
        createUser(socket, res[0], res[1], res[2]);
    });
    socket.on('clientLoginMessage', function (content) {
        var res = content.split(":");
        checkUserExistsInDatabase(socket, res[0], res[1], res[2]);
    });
    socket.on('clientLogoutMessage', function (content) {
        var res = content.split(":");
        removePlayer(socket, res[0], res[1]);
    });
    socket.on('clientCreateGameMessage', function (content) {
        var res = content.split(":");
        createGame(socket, res[0], res[1], res[2]);
    });
    socket.on('clientQueuesMessage', function (content) {
        getQueues(socket);
    });
    socket.on('clientJoinGameMessage', function (content) {
        var res = content.split(":");
        joinQueue(socket, res[0], res[1], res[2]);
    });
    socket.on('clientStartGameMessage', function (content) {
        var res = content.split(":");
        startQueue(socket, res[0], res[1]);
    });
    socket.on('clientReadyMessage', function (content) {
        var res = content.split(":");
        addToReady(socket, res[0], res[1]);
    });
}
function insert(socket, fQuestion, foption1, foption2, foption3, foption4, fCorrect, fImg) {
    var q = new Question.init(Question.questions.length - 1, fQuestion, foption1, foption2, foption3, foption4, fCorrect, fImg);
    Question.addQuestion(q);
    database.addQuestion(q);
    socket.emit('serverInsertMessage', true);
}
function createUser(socket, id, name, pass) {
    var address = socket.handshake.address;
    var row = user.checkIfNameExists(name);
    if (row == -1) {
        var u = new user.init(id, name, 1, pass, "", 0);
        database.addUser(u);
        var p = new player.init(socket, id, address, name, null, true, false, true);
        player.replaceUnregisteredPlayerWithRegisteredPlayer(p);
        var admin = false;
        socket.emit('serverRegisterMessage', true + ":" + name + ":" + admin);
        socket.emit('serverClientIdName', p.id+ ":" + p.name);
    } else socket.emit('serverRegisterMessage', false + ":" + name + ":" + false);
}
function addToReady(socket, id, instance) {
    var p = player.getPlayer(id);
    var playerQueued = game.checkPlayerIsQueued(instance, p);
    if (playerQueued) {
        game.addPlayerToReady(instance, p);
    }
    var everyoneReady = game.checkEveryoneReady(instance);
    if (everyoneReady) {
        getQuestion(instance, 0);
    }
    if(game.games[instance].amount=="1") getQuestion(instance, 0);
}
function joinQueue(socket, id, name, instance) {
    var p = player.getPlayerByName(name);
    if (!game.checkIfPlayerIsPlayingById(id)) {
        game.joinPlayerToGame(p, instance);
        game.addPlayerPlaying(p);
    }
    var message = "";
    for (i = 0; i < game.games.length; i++) {
        if (!game.checkEveryoneReady(i)) message += i + ":" + game.games[i].players.length + ":" + game.games[i].amount + ";";
    }
    socket.broadcast.emit('serverQueuesMessage', message);
    socket.emit('serverQueuesMessage', message);
    if(game.games[instance].amount>1){
        var fullQueue = game.checkIfQueueIsFull(instance);
        if (fullQueue) {
            var SocketsPlayers = game.getSocketsPlayers(instance);
            for (i = 0; i < SocketsPlayers.length; i++) {
                if (typeof SocketsPlayers[i] !== 'undefined') {
                    SocketsPlayers[i].socket.emit('serverQueueIsFullMessage', true);
                }
            }
        }
    }else{
        socket.emit('serverSinglePlayer', true);
    }

}
function startQueue(socket, id, instance) {
    var p = player.getPlayerById(id);
    if (game.checkPlayerIsQueued(instance, p)) {
        game.addPlayerToReady(instance, p)
    }
    var message = "";
    for (i = 0; i < game.games.length; i++) {
        if (!game.checkEveryoneReady(i)) message += i + ":" + game.games[i].players.length + ":" + game.games[i].amount + ";";
    }
    socket.broadcast.emit('serverQueuesMessage', message);
    var fullQueue = game.checkEveryoneReady(instance);
    if (fullQueue) {
        game.games[instance].playing = true;
        var SocketsPlayers = game.getSocketsPlayers(instance);
        for (i = 0; i < SocketsPlayers.length; i++) {
            SocketsPlayers[i].socket.emit('serverEveryoneReadyMessage', true);
        }
    }
}
function getQuestion(instance, index) {
    //var question = 'http://pcoe.nl/@api/deki/files/6/=Gebouw_1.jpg';
    //var answer = "";
    var row = index + 1;
    var SocketsPlayers = game.getSocketsPlayers(instance);
    var question = game.games[instance].questions[index];
    for (i = 0; i < SocketsPlayers.length; i++) {
        SocketsPlayers[i].socket.emit('serverQuestionMessage', row + ":" + question.question + ":" + question.option1 + ":" + question.option2 + ":" + question.option3 + ":" + question.option4 + ":" + question.img + ":" + question.xLoc + ":" + question.yLoc);
    }
}
function getQueues(socket) {
    var message = "";
    for (i = 0; i < game.games.length; i++) {
        if (!game.checkEveryoneReady(i)) message += i + ":" + game.games[i].players.length + ":" + game.games[i].amount + ";";
    }
    socket.emit('serverQueuesInitiatedMessage', message);
}
function createGame(socket, id, name, amount) {
    var p = player.getPlayerByName(name);
    var gameId = -1;
    if (!game.checkIfPlayerIsPlayingById(id)) {
        var gameInit = new game.init(p, amount);
        if (gameInit) {
            game.addGame(gameInit);
            game.addPlayerPlaying(p);
            gameId = game.getId();
        }
    }
    var message = "";
    for (i = 0; i < game.games.length; i++) {
        if (!game.checkEveryoneReady(i)) message += i + ":" + game.games[i].players.length + ":" + game.games[i].amount + ";";
    }
    socket.broadcast.emit('serverQueuesMessage', message);
    socket.emit('serverQueuesMessage', message);
    socket.emit('serverGameInstanceMessage', gameId);
    joinQueue(socket, id, name, gameId);
}
function replaceUser(socket, id, name) {
    var address = socket.handshake.address;
    var admin = false;
    var p = new player.init(socket, id, address, name, null, true, false, true);
    player.replaceUnregisteredPlayerWithRegisteredPlayer(p);
    socket.emit('serverRegisterMessage', true + ":" + name + ":" + admin);
}
function checkUserExistsInDatabase(socket, id, name, pass) {
    var address = socket.handshake.address;
    var row = user.checkIfExists(name, pass);
    if (row >= 0) {
        var logedin = player.getPlayerById(id);
        if (logedin != null) {
            if (logedin.name == null) {
                var p = new player.init(socket, id, address, name, null, true, false, true);
                player.replaceUnregisteredPlayerWithRegisteredPlayer(p);
                var admin = false;
                if (user.getUser(row).rank == 0) admin = true;
                socket.emit('serverLoginMessage', true + ":" + name + ":" + admin);
                socket.emit('serverClientIdName', p.id+ ":" + p.name);
            }
        }
    } else socket.emit('serverLoginMessage', false + ":" + name + ":" + false);
}
function removePlayer(socket, id, name) {
    var p = player.getPlayerById(id);
    if (p != null) {
        player.removePlayer(p);
        socket.emit('serverLogoutMessage', true);
    }
    else socket.emit('serverLogoutMessage', false);
}

module.exports.getHandlers = getHandlers;