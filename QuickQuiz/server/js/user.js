/**
 * Created by alisio on 2/01/2015.
 */
var user = (function () {
    var users = new Array();
    var init = function (id, name, rank, password, img, score) {
        this.id = id;
        this.name = name;
        this.rank = rank;
        this.password = password;
        this.img = img;
        this.score = score;
    };
    init.prototype = {
        get ID() {
            return this.id
        },
        set ID(v) {
            this.id = v
        },
        get Name() {
            return this.name
        },
        set Name(v) {
            this.name = v
        },
        get Rank() {
            return this.rank
        },
        set Rank(v) {
            this.rank = v
        },
        get Password() {
            return this.password
        },
        set Password(v) {
            this.password = v
        },
        get Img() {
            return this.img
        },
        set Img(v) {
            this.img = v
        },
        get Score() {
            return this.score
        },
        set Score(v) {
            this.score = v
        }
    };
    var addUser = function (user) {
        users.push(user);
    };
    var checkIfNameExists = function(name){
        for(i = 0; i < users.length;i++){
            if(users[i].name == name) return i;
        }
        return -1;
    };
    var updateUser = function (id, user) {
        users[id] = user;
    };
    var getUser = function(id){
        return users[id];
    };
    var checkIfExists = function (name, pass) {
        for(i = 0; i < users.length;i++){
            if(users[i].name == name && users[i].password == pass) return i;
        }
        return -1;
    };
    return {
        init: init,
        addUser: addUser,
        updateUser: updateUser,
        getUser: getUser,
        checkIfExists: checkIfExists,
        checkIfNameExists: checkIfNameExists,
        users: users
    }
})();

module.exports = user;