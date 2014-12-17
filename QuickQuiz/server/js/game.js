/**
 * Created by alisio on 6/12/2014.
 */
var Game = (function () {
    var max = 10;
    var id = -1;
    var amountPLayers = new Array()[1, 2, 3, 4];

    var games = new Array();
    var playersPlaying = new Array();

    var init = function (player, amount) {
        if(id < max) id++;
        else return false;
        var playersList = new Array();
        playersList.push(player);
        this.players = playersList;
        var playersreadyList = new Array();
        this.playersReady = playersreadyList;
        this.amount = amount;
        return true;
    };
    init.prototype = {
        get Amount() {
            return this.amount
        },
        set Amount(v) {
            this.amount = v
        },
        get Players() {
            return this.players
        },
        set Players(v) {
            this.players = v
        },
        get PlayersReady() {
            return this.playersReady
        },
        set PlayersReady(v) {
            this.playersReady = v
        }
    };
    var addGame = function (game) {
        games.push(game);
    };
    var joinPlayerToGame = function (player, id) {
        if(games[id].players.length < games[id].amount) games[id].players.push(player);
    };
    var checkIfQueueIsFull = function(id){
        if(games[id].players.length == games[id].amount) return true;
        else return false;
    };
    var getSocketsPlayers = function(id){
        return games[id].players;
    };
    var addPlayerPlaying = function (player) {
        playersPlaying.push(player);
    };
    var checkIfPlayerIsPlaying = function (player) {
        if (playersPlaying.indexOf(player) > -1) return true;
        else return false;
    };
    var addPlayerToReady = function (id, player) {
        games[id].playersReady.push(player);
    };
    var checkPlayerIsQueued = function(id, player){
        if (games[id].players.indexOf(player) > -1) return true;
        else return false;
    };
    var checkEveryoneReady = function(id){
        if(games[id].playersReady.length == games[id].amount) return true;
        else return false;
    };
    var getId = function(){
        return id;
    };
    return {
        Game: Game,
        init: init,
        amountPLayers: amountPLayers,
        joinPlayerToGame: joinPlayerToGame,
        addPlayerPlaying: addPlayerPlaying,
        checkIfQueueIsFull: checkIfQueueIsFull,
        getSocketsPlayers: getSocketsPlayers,
        checkIfPlayerIsPlaying: checkIfPlayerIsPlaying,
        addPlayerToReady: addPlayerToReady,
        playersPlaying: playersPlaying,
        checkPlayerIsQueued: checkPlayerIsQueued,
        checkEveryoneReady: checkEveryoneReady,
        games: games,
        addGame: addGame,
        id: id,
        getId: getId
    };
})();
module.exports = Game;

