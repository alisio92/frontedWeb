/**
 * Created by alisio on 5/01/2015.
 */
var question = (function () {
    var questions = new Array();
    var init = function (id, question, option1, option2, option3, option4, correct, img, xLoc, yLoc) {
        this.id = id;
        this.question = question;
        this.option1 = option1;
        this.option2 = option2;
        this.option3 = option3;
        this.option4 = option4;
        this.correct = correct;
        this.img = img;
        this.xLoc = xLoc;
        this.yLoc = yLoc;
    };
    init.prototype = {
        get ID() {
            return this.id
        },
        set ID(v) {
            this.id = v
        },
        get Question() {
            return this.question
        },
        set Question(v) {
            this.question = v
        },
        get Option1() {
            return this.option1
        },
        set Option1(v) {
            this.option1 = v
        },
        get Option2() {
            return this.option2
        },
        set Option2(v) {
            this.option2 = v
        },
        get Option3() {
            return this.option3
        },
        set Option3(v) {
            this.option3 = v
        },
        get Option4() {
            return this.option4
        },
        set Option4(v) {
            this.option4 = v
        },
        get Correct() {
            return this.correct
        },
        set Correct(v) {
            this.correct = v
        },
        get Img() {
            return this.img
        },
        set Img(v) {
            this.img = v
        },
        get XLoc() {
            return this.xLoc
        },
        set XLoc(v) {
            this.xLoc = v
        },
        get YLoc() {
            return this.yLoc
        },
        set YLoc(v) {
            this.yLoc = v
        }
    };
    var addQuestion = function (question) {
        questions.push(question);
    };
    return {
        init: init,
        addQuestion: addQuestion,
        questions: questions
    }
})();

module.exports = question;