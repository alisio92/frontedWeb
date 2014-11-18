/**
 * Created by alisio on 18/11/2014.
 */
var net = require('net');
var path = require('path');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
app.use(express.static(path.join(__dirname, '/')));
http.listen(80);
//var server = net.Server();
var ip = '192.168.1.2';
var port = 6600;
//server.listen(port, ip);
var test = [];

function AddToList(value){
    test.push(value);
}

var server= net.createServer({
        allowHalfOpen: false
    },
//3. Connection listener
    function (socket) {
//elke binnenkomende connectie verwerken
        console.log("server heeft nieuwe connectie");
        socket.setEncoding('utf8');
        socket.write("Dit is een customised boodschap voor de client.")
        socket.on("data", function (data) {
//ontvangst van browser headers of van cliënt data.
            if (data) {
                console.log(test);
                //console.log("ontvangen data: " + data )
            }
            //return socket.end();//beëindigt wel de socket
        });
        /*socket.on("end", function (data) {
            console.log("Goodbye. Client connectie is beëindigd.");
        });*/
    })
//2. TCP server luistert naar poort 1337 (listening listener)
server.listen(port, ip, function () {
    console.log("luisteren naar poort" + server.address().port);
// server.close();
});
//4. error handling
server.on("error", function (error) {
    if (error.code === "EADDRINUSE") {
        console.log("Deze poort is reeds in gebruik");
    } else {
        console.log("Fout"+ error.message);
    }
});