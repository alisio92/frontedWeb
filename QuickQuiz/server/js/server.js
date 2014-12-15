/**
 * Created by alisio on 30/11/2014.
 */
var port = 4000;
var ip = "localhost";
var requestHandlers = require("./requestHandlers.js");
var router = require("./router.js")
var socketHandlers = require("./socketHandlers.js");
//var database = require("./database.js");

//1. static Server activeren
var staticServer = require("./staticServer.js");

//2. Alle nodige params : routinghandlers definiëren
var handlers = {}
handlers["/"] = requestHandlers.root;

//database.init();
staticServer.init(router, handlers, ip, port, socketHandlers);
