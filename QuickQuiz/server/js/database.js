/**
 * Created by alisio on 15/12/2014.
 */
var query = require("./../jQuery/jquery-2.1.1.js");
var Database = (function () {
    var init = function () {
        query.jQuery.ajax({
            type: "POST",
            url: './../php/connection.php',
            dataType: 'php',
            data: {functionname: 'init_database', arguments: []},

            success: function (obj, textstatus) {
                if (!('error' in obj)) {
                    yourVariable = obj.result;
                }
                else {
                    console.log(obj.error);
                }
            }
        });
    };
    return {
        init: init
    };
})();
module.exports = Database;