/**
 * Created by alisio on 6/12/2014.
 */
var Player = (function () {
    var players = new Array();
    var init = function (socket, id, ip, name, img, registered, admin) {
        this.socket = socket;
        this.id = id;
        this.ip = ip;
        this.name = name;
        this.img = img;
        this.registered = registered;
        this.admin = admin;
        this.score = 0;
    };
    init.prototype = {
        get Socket() {
            return this.socket
        },
        set Socket(v) {
            this.socket = v
        },
        get ID() {
            return this.id
        },
        set ID(v) {
            this.id = v
        },

        get IP() {
            return this.ip
        },
        set IP(v) {
            this.ip = v
        },

        get Name() {
            return this.name
        },
        set Name(v) {
            this.name = v
        },

        get Img() {
            return this.img
        },
        set Img(v) {
            this.img = v
        },

        get Registered() {
            return this.registered
        },
        set Registered(v) {
            this.registered = v
        },

        get Admin() {
            return this.admin
        },
        set Admin(v) {
            this.admin = v
        },

        get Score() {
            return this.score
        },
        set Score(v) {
            this.score = v
        }
    };
    var addUser = function (player) {
        players.push(player);
    };
    var removePlayer = function (player) {
        players.splice(player.id, 1);
    };
    var replaceUnregisteredPlayerWithRegisteredPlayer = function (player) {
        players[player.id] = player;
    };
    var checkIfExists = function (player) {
        if (players.indexOf(player) > -1) return true;
        else return false;
    };
    var getPlayer = function(player){
        return players[player.id];
    };
    var getPlayerById = function(id){
        for(i = 0; i< players.length;i++){
            if(players[i].id == id) return players[i];
        }
        return null;
    };
    return {
        init: init,
        addUser: addUser,
        replaceUnregisteredPlayerWithRegisteredPlayer: replaceUnregisteredPlayerWithRegisteredPlayer,
        checkIfExists: checkIfExists,
        getPlayer: getPlayer,
        removePlayer: removePlayer,
        getPlayerById: getPlayerById,
        players: players
    }
})();

module.exports = Player;
