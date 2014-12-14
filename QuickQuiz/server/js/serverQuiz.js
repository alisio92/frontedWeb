/**
 * Created by alisio on 6/12/2014.
 */
//var players = [];

/*function ServerQuiz(){

 };

 function addUser(player){
 players.push(player);
 }

 function replaceUnregisteredPlayerWithRegisteredPlayer(unregisteredPlayer, registeredPlayer){
 var i = players.indexOf(unregisteredPlayer);
 players[i] = registeredPlayer;
 }*/

var ServerQuiz = (function () {
    var players = new Array();

    var addUser = function (player) {
        players.push(player);
    };
    var replaceUnregisteredPlayerWithRegisteredPlayer = function (unregisteredPlayer, registeredPlayer) {
        var i = players.indexOf(unregisteredPlayer);
        players[i] = registeredPlayer;
    };
    var checkIfExists = function (player) {
        if (players.indexOf(player) > -1) return true;
        else return false;
    };
    var replaceUnregisteredPlayerWithRegisteredPlayerById = function (id, player) {
        players[id] = player;
    };
    return {
        players: players,
        addUser: addUser,
        replaceUnregisteredPlayerWithRegisteredPlayer: replaceUnregisteredPlayerWithRegisteredPlayer,
        replaceUnregisteredPlayerWithRegisteredPlayerById: replaceUnregisteredPlayerWithRegisteredPlayerById,
        checkIfExists: checkIfExists
    };
})();
module.exports = ServerQuiz;

