/**
 * Created by alisio on 30/11/2014.
 */
var port = 4000;
var ip = "192.168.1.2";
var requestHandlers = require("./requestHandlers.js");
var router = require("./router.js")
var socketHandlers = require("./socketHandlers.js");

//1. static Server activeren
var staticServer = require("./staticServer.js");

//2. Alle nodige params : routinghandlers definiëren
var handlers = {}
handlers["/"] = requestHandlers.root;

staticServer.init( router , handlers ,port, socketHandlers);