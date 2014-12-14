/**
 * Created by alisio on 22/11/2014.
 */
var indexHTML = "../../client/index.html";
var requestHandlers = require("./requestHandlers"),
    path = require('path');

var localMaps = {
    ".html": "../../client/",
    ".php": "./../../client/php/",
    ".css": "./../../client/css/",
    ".map": "./../../client/css/",
    ".js": "./../../client/js/",
    ".png": "../../client/",
    ".gif": "../../../client/",
    ".jpg": "../../client/",
    ".woff": "../../fonts/",
    ".ttf": "../../fonts/",
    ".ico": "../../client/"
}

var getRoute = function (handlers, uri, request, response) {
    var url = path.basename(request.url) || indexHTML,
        ext = path.extname(url);
    pathname = "/" + url.split("?")[0];

    if ((typeof localMaps[ext] !== 'undefined' && url != "favicon.ico" )) {
        console.log("file loading " + uri);
        requestHandlers.readFile(localMaps[ext] + url, response);
    } else if (typeof (handlers[pathname]) === "function") {
        handlers[pathname](request, response);
    } else {
        console.log("No request handler found for " + uri);
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not found");
        response.end();
    }
};

module.exports.getRoute = getRoute;
