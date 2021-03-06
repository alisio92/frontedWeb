/**
 * Created by alisio on 15/12/2014.
 */
var fs = require('fs');
var User = require("./user.js");
var Question = require("./question.js");
var filePath = './../data/users.txt';
var filePath2 = './../data/questions.txt';
var Database = (function () {
    var init = function () {
        fs.readFile(filePath, 'utf8', function (err,data) {
            var row = data.split(";");
            for(i = 0; i < row.length;i++){
                var r = row[i].split(":");
                if(r.length>1) {
                    u = new User.init(r[0], r[1], r[2], r[3], r[4], r[5]);
                    User.addUser(u);
                }
            }
        });

        fs.readFile(filePath2, 'utf8', function (err,data) {
            var row = data.split(";");
            for(i = 0; i < row.length;i++){
                var r = row[i].split(":");
                if(r.length>1){
                    q = new Question.init(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9]);
                    Question.addQuestion(q);
                }
            }
        });
    };
    var addUser = function(user){
        User.addUser(user);
        /*fs.appendFile(filePath, "\n", function (err) {
        });*/
        fs.appendFile(filePath, User.users.length-1 + ":" + user.name + ":" + user.rank + ":" + user.password + ":" + user.img + ":" + user.score + ";", function (err) {
        });
    };
    var addQuestion = function(question){
        Question.addQuestion(question);
        /*fs.appendFile(filePath2, "\n", function (err) {
        });*/
        fs.appendFile(filePath2, Question.questions.length-1 + ":" + question.question + ":" + question.option1 + ":" + question.option2 + ":" + question.option3 + ":" + question.option4 + ":" + question.correct + ":" + question.img + ":" + question.xLoc + ":" + question.yLoc + ";", function (err) {
        });
    };
    var updateUser = function(p) {
        for(i = 0;i<User.users.length;i++){
            if(User.users[i].name == p.name) User.users[i].score += p.score;
        }
    };
    var updateUsers = function(){
        var u = "";
        for(i = 0; i < User.users.length;i++){
            //d, name, rank, password, img, score
            u+= User.users[i].id + ":" + User.users[i].name + ":" + User.users[i].rank + ":" + User.users[i].password + ":" + User.users[i].img + ":" + User.users[i].score + ";";
        }
        fs.writeFile(filePath, u, function(err) {
            if(err) {
                console.log(err);
            } else {
            }
        });
    };
    return {
        init: init,
        addUser: addUser,
        updateUsers: updateUsers,
        updateUser: updateUser,
        addQuestion: addQuestion
    };
})();
module.exports = Database;