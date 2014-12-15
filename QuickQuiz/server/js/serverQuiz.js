/**
 * Created by alisio on 6/12/2014.
 */
var ServerQuiz = (function () {
    var players = new Array();
    var games = new Array();
    var playersPlaying = new Array();

    var addUser = function (id, player) {
        players[id] = player;
    };
    var addPlayerPlaying = function (player) {
        playersPlaying.push(player);
    };
    var joinPlayerToGame = function (player, id) {
        if(games[id].players.length < games[id].amount) games[id].players.push(player);
    };
    var replaceUnregisteredPlayerWithRegisteredPlayer = function (unregisteredPlayer, registeredPlayer) {
        var i = players.indexOf(unregisteredPlayer);
        players[i] = registeredPlayer;
    };
    var checkIfExists = function (player) {
        if (players.indexOf(player) > -1) {
            return true;
        }
        else return false;
    };
    var checkIfPlayerIsPlaying = function (player) {
        if (playersPlaying.indexOf(player) > -1) return true;
        else return false;
    };
    var replaceUnregisteredPlayerWithRegisteredPlayerById = function (id, player) {
        players[id] = player;
    };
    var addGame = function (game) {
        games.push(game);
    };
    var getPlayer = function (id){
        return players[id];
    };
    return {
        players: players,
        games: games,
        playersPlaying: playersPlaying,
        addUser: addUser,
        replaceUnregisteredPlayerWithRegisteredPlayer: replaceUnregisteredPlayerWithRegisteredPlayer,
        replaceUnregisteredPlayerWithRegisteredPlayerById: replaceUnregisteredPlayerWithRegisteredPlayerById,
        checkIfExists: checkIfExists,
        addGame: addGame,
        getPlayer: getPlayer,
        addPlayerPlaying: addPlayerPlaying,
        checkIfPlayerIsPlaying: checkIfPlayerIsPlaying,
        joinPlayerToGame: joinPlayerToGame
    };
})();
module.exports = ServerQuiz;

