/**
 * Created by alisio on 22/11/2014.
 */
var indexHTML = "./../../client/index.html";
var path = require("path"),
    fs = require("fs"),
    url = require('url');


//1. requesthandlers ----------------------------------
var root = function (req, res) {
    readFile(indexHTML, res);
}

//2. lezen van  files in de map volgens extensie ----
var extensions = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".gif": "image/gif",
    ".jpg": "image/jpeg",
    ".php": "application/php"
};
var readFile = function (uri, res) {
    //haal extensie op
    var ext = path.extname(uri),
        localPath = path.normalize(process.cwd() + uri);

    // lees file

    fs.exists(localPath, function (exists) {
        if (exists) {
            fs.readFile(localPath, function (err, contents) {
                if (!err) {
                    res.writeHead(200, {"Content-Type": extensions[ext]});
                    res.write(contents); //in hex is OK
                }
                res.end();
            });
        } else {
            res.writeHead(404, {'content-type': 'text/html'});
            res.write('File not found: ' + filename);
        }
    });
};

// exports --------------------------------------------
exports.root = root;
exports.readFile = readFile;