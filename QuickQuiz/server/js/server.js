/**
 * Created by alisio on 30/11/2014.
 */
var port = 4000;
var ip = "192.168.1.3";
var requestHandlers = require("./requestHandlers.js");
var router = require("./router.js")
var socketHandlers = require("./socketHandlers.js");

(function () {
    jQuery.ajax({
        type: "POST",
        url: './../connection.php',
        dataType: 'json',
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
});

//1. static Server activeren
var staticServer = require("./staticServer.js");

//2. Alle nodige params : routinghandlers definiëren
var handlers = {}
handlers["/"] = requestHandlers.root;

staticServer.init(router, handlers, ip, port, socketHandlers);
