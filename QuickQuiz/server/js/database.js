/**
 * Created by alisio on 15/12/2014.
 */
var lineReader = require('line-reader');
var fs = require('fs');
var User = require("./user.js");
var filePath = './../data/users.txt';
var Database = (function () {
    var init = function () {
        lineReader.open(filePath, function(reader) {
            reader.nextLine(function(line) {});
            while (reader.hasNextLine()) {
                reader.nextLine(function(line) {
                    var row = line.split(":");
                    u = new User.init(row[0], row[1], row[2], row[3], row[4], row[5]);
                    User.addUser(u);
                });
            }
        });
    };
    var addUser = function(user){
        User.addUser(user);
        fs.appendFile(filePath, "\r\n" + User.users.length-1 + ":" + user.name + ":" + user.rank + ":" + user.password + ":" + user.img + ":" + user.score, function (err) {
        });
    };
    return {
        init: init,
        addUser: addUser
    };
})();
module.exports = Database;