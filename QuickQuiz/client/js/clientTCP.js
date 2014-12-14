/**
 * Created by alisio on 30/11/2014.
 */
var socket = io.connect("http://192.168.1.3:4000");
var inpClient = document.getElementById('name');
var messages = document.getElementById('messages');
var btn = document.getElementById('send');
var lastMsg; //div element met client message
var id = -1;

//btn.addEventListener("click", save);

socket.on("serverMessage", function (json) {
    showMessage(JSON.parse(json));
});

socket.on("serverGiveNumberUsers", function (json) {
    document.getElementById("online").innerHTML = "Aantal gebruikers online: " + JSON.parse(json);
});

socket.on("serverClientId", function (json) {
    id = JSON.parse(json);
});

socket.on("serverLoginMessage", function (content) {
    var response = content;
    var res = response.split(":");
    if(res[0]) {
        document.getElementById("login").innerHTML = res[1];
        closeButton();
    }
    if(res[2]){
        var ul = document.getElementById("mainNav").innerHTML;
        var newUl= '<li><a href="" title="Ga naar Admin pagina" alt="Ga naar Admin pagina">Admin</a></li>';
        newUl += ul;
        document.getElementById("mainNav").innerHTML = newUl;
    }
});

socket.on("serverRegisterMessage", function (content) {
    var response = content;
    var res = response.split(":");
    if(res[0]) {
        document.getElementById("login").innerHTML = res[1];
        closeButton();
    }
    if(res[2]){
        var ul = document.getElementById("mainNav").innerHTML;
        var newUl= '<li><a href="" title="Ga naar Admin pagina" alt="Ga naar Admin pagina">Admin</a></li>';
        newUl += ul;
        document.getElementById("mainNav").innerHTML = newUl;
    }
});

function showMessage(obj) {
    var newMsg = document.createElement("div");
    newMsg.appendChild(document.createTextNode(obj.id + " said: " + obj.content));

    messages.insertBefore(newMsg, lastMsg)
    lastMsg = newMsg;
}

function loginTCP(name, pass) {
    socket.emit('clientLoginMessage',id + ":" +name + ":" + pass);
}

function registerTCP(name, pass) {
    socket.emit('clientRegisterMessage',id + ":" + name + ":" + pass);
}

function save() {
    socket.emit('clientMessage', inpClient.value);
    inpClient.value = '';
}
