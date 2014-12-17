/**
 * Created by alisio on 16/12/2014.
 */
var Quiz;
(function (Quiz) {
    var players = new Array();
    var Test = (function () {
        function Test(id, ip, name, img, registered, admin) {
            this.id = id;
            this.ip = ip;
            this.name = name;
            this.img = img;
            this.registered = registered;
            this.admin = admin;
            this.score = 0;
        }
        Test.prototype.addUser = function (player) {
            players.push(player);
        };
        return Test;
    })();
    Quiz.Test = Test;
})(Quiz || (Quiz = {}));
//# sourceMappingURL=test.js.map