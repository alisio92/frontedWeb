/**
 * Created by alisio on 6/12/2014.
 */
var Question = require("./question.js");
var Game = (function () {
    var max = 10;
    var id = -1;
    var amountPLayers = new Array()[1, 2, 3, 4];

    var games = new Array();
    var playersPlaying = new Array();

    var init = function (player, amount) {
        if(id < max) id = games.length;
        else return false;
        var playersList = new Array();
        playersList.push(player);
        this.players = playersList;
        var playersreadyList = new Array();
        this.playersReady = playersreadyList;
        this.amount = amount;
        this.playing = false;
        this.timer = 120;
        this.questions = getQuestions();
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
        },
        get Playing() {
            return this.playing
        },
        set Playing(v) {
            this.playing = v
        },
        get Timer() {
            return this.timer
        },
        set Timer(v) {
            this.timer = v
        },
        get Questions() {
            return this.questions
        },
        set Questions(v) {
            this.questions = v
        }
    };
    var getQuestions = function(){
        var questions = [];
        var aantal = 10;
        var numbers = [];
        for(i = 0; i < aantal;i++){
            var index = -1;
            while(index<0){
                index = Math.floor((Math.random() * Question.questions.length));
                for(i2 = 0; i2<numbers.length;i2++){
                    if(index == numbers[i2]) index = -1;
                }
            }
            numbers.push(index);
            questions.push(Question.questions[index]);
        }
        return questions;
    };
    var addGame = function (game) {
        games.push(game);
    };
    var removeGame = function(id){
        games.splice(id, 1);
    };
    var joinPlayerToGame = function (player, id) {
        if(games[id].players.length < games[id].amount) games[id].players.push(player);
    };
    var checkIfQueueIsFull = function(id){
        if(typeof games[id].players !== 'undefined') {
            if (games[id].players.length == games[id].amount) return true;
        }
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
    var checkIfPlayerIsPlayingById = function (id) {
        for(i = 0;i< playersPlaying.length;i++){
            if(typeof playersPlaying[i] !== 'undefined') {
                if (playersPlaying[i].id == id) return true;
            }
        }
        return false;
    };
    var addPlayerToReady = function (id, player) {
        games[id].playersReady.push(player);
    };
    var checkPlayerIsQueued = function(id, player){
        if (games[id].players.indexOf(player) > -1) return true;
        else return false;
    };
    var checkEveryoneReady = function(id){
        if(typeof games[id] !== 'undefined') {
            if (games[id].playersReady.length == games[id].amount) return true;
            else return false;
        }
        else return false;
    };
    var checkEveryoneJoined = function(id){
        if(typeof games[id] !== 'undefined') {
            if (games[id].players.length == games[id].amount) return true;
            else return false;
        }
        else return false;
    };
    var getId = function(){
        return id;
    };
    var removePlayerFromGame = function(player){
        var index = -1;
        for(n = 0;n<playersPlaying.length;n++){
            if(playersPlaying[n].name== player.name) index = n;
        }
        if(index >=0) {
            playersPlaying.splice(index, 1);
            for(i = 0; i < games.length;i++){
                var index2 = games[i].players.indexOf(player);
                games[i].players.splice(index2, 1);
                var index3 = games[i].playersReady.indexOf(player);
                games[i].playersReady.splice(index3, 1);
            }
        }
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
        checkIfPlayerIsPlayingById: checkIfPlayerIsPlayingById,
        checkEveryoneJoined: checkEveryoneJoined,
        removeGame: removeGame,
        games: games,
        addGame: addGame,
        removePlayerFromGame: removePlayerFromGame,
        id: id,
        getId: getId
    };
})();
module.exports = Game;

