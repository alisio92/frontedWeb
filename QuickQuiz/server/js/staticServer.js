/**
 * Created by alisio on 22/11/2014.
 */
var staticServer = (function () {
    var http = require('http'),
        fs = require('fs'),
        path = require('path'),
        url = require('url'),
        domain = require('domain'),
        httpDomain = domain.create()


    var httpListen = function (router, handlers, httpPort, httpIP, socketHandlers) {
        httpDomain.on('error', function (err) {
            console.log('Error in the http domain:', err);
        });

        httpDomain.run(function () {
            var httpServer = http.createServer(handler)
            httpServer.listen(httpPort, httpIP);

            // socketServer listens to httpServer
            //var io = require('socket.io').listen(httpServer);
            socketHandlers.getHandlers(httpServer);

            function handler(req, res) {
                //1. routing ophalen
                var uri = url.parse(req.url).pathname;
                console.log("routing ophalen voor uri : " + uri)

                router.getRoute(handlers, uri, req, res);
            }
        });
    };

    var extensions = {
        ".html": "text/html",
        //".php": "application/php",
        ".css": "text/css",
        ".js": "application/javascript",
        ".png": "image/png",
        ".gif": "image/gif",
        ".jpg": "image/jpeg"
    };

    var init = function (router, handlers, httpIP, httpPort, socketHandlers) {
        console.log("server running on address: " + httpIP + ", port:", httpPort, socketHandlers);
        httpListen(router, handlers, httpPort, httpIP, socketHandlers);
    };

    return {
        init: init
    }
})();

module.exports = staticServer;