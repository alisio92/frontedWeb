/**
 * Created by alisio on 6/12/2014.
 */
/*function Player(id, ip, name, img, registered, admin){
 this.id = id;
 this.ip = ip;
 this.name = name;
 this.img = img;
 this.registered = registered;
 this.admin = admin;
 this.score = 0;
 };

 Player.prototype = {
 get ID() { return this.id},
 set ID(v){ this.id = v},

 get IP() { return this.ip},
 set IP(v){ this.ip = v},

 get Name() { return this.name},
 set Name(v){ this.name = v},

 get Img() { return this.img},
 set Img(v){ this.img = v},

 get Registered() { return this.registered},
 set Registered(v){ this.registered = v},

 get Admin() { return this.admin},
 set Admin(v){ this.admin = v},

 get Score() { return this.score},
 set Score(v){ this.score = v}
 }*/

var Player = (function () {
    var init = function (id, ip, name, img, registered, admin) {
        this.id = id;
        this.ip = ip;
        this.name = name;
        this.img = img;
        this.registered = registered;
        this.admin = admin;
        this.score = 0;
    };

    init.prototype = {
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
    }

    return {
        init: init
    }
})();

module.exports = Player;
