/**
 * Created by alisio on 18/11/2014.
 */
var net = require("net");
var ip = '192.168.1.2';
var port = 6600;
var client = net.connect(port, ip, function () {
    console.log("client maakt verbinding");
//3. client (connectie) is een stream en kan dus read/write methodes uitvoeren
    client.write("hier een boodschap van de TCP client");

    setInterval(function () {
        client.write('ping');
    }, 1000 * 2);
});
