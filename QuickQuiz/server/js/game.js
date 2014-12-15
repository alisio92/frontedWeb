/**
 * Created by alisio on 6/12/2014.
 */
var Game = (function () {
    var max = 10;
    var id = -1;
    var amountPLayers = new Array()[1, 2, 3, 4];
    var init = function (player, amount) {
        if(id < max) id++;
        else return false;
        var playersList = new Array();
        playersList.push(player);
        this.players = playersList;
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
        }
    };
    return {
        Game: Game,
        init: init,
        amountPLayers: amountPLayers
    };
})();
module.exports = Game;

