/**
 * Created by alisio on 22/11/2014.
 */
var domain = require("domain")

var getHandlers = function (httpServer) {
    var socketDomain = domain.create();
    socketDomain.on('error', function (err) {
        console.log('Error caught in socket domain:' + err);
    })

    socketDomain.run(function () {
        var io = require('socket.io').listen(httpServer);
        io.sockets.on('connection', function (socket) {
            var address = socket.handshake.address;
            //console.log("sockets connection established " + address.address+":"+address.port);
            console.log("sockets connection established " + socket.request.connection.remoteAddress);
            socket.on('clientMessage', function (content) {
                //emit laat toe een json object te sturen
                var obj = { color: socket.color , id : socket.id , content: content }
                socket.emit('serverMessage', JSON.stringify(obj)); //naar zichzelf
                socket.broadcast.emit('serverMessage', JSON.stringify(obj)); // naar andere clients only
            });
        });
    });
};

module.exports.getHandlers = getHandlers;