/**
 * Created by alisio on 30/11/2014.
 */
var socket = io.connect("http://localhost:4000");
var inpClient = document.getElementById('name');
var messages = document.getElementById('messages');
var btn = document.getElementById('send');
var lastMsg; //div element met client message
var playerId = -1;
var registeredPlayer = false;
var propTCP = null;

//btn.addEventListener("click", save);

socket.on("serverMessage", function (json) {
    showMessage(JSON.parse(json));
});

socket.on("serverGiveNumberUsers", function (json) {
    document.getElementById("online").innerHTML = "Aantal gebruikers online: " + JSON.parse(json);
});

socket.on("serverClientId", function (json) {
    playerId = JSON.parse(json);
});

socket.on("serverQueuesMessage", function (content) {
    var response = content;
    var res = response.split(";");
    generateQueuesList(res);
});

socket.on("serverQueuesInitiatedMessage", function (content) {
    var response = content;
    var res = response.split(";");
    var xAngle = 0, yAngle = 0;
    generateQueuesList(res);
    yAngle -= 90;
    document.getElementById('cube').style[propTCP] = "rotateX(" + xAngle + "deg) rotateY(" + yAngle + "deg)";
});

socket.on("serverLoginMessage", function (content) {
    var response = content;
    var res = response.split(":");
    if (res[0]) {
        registeredPlayer = res[0];
        document.getElementById("login").innerHTML = res[1];
        closeButton();
    }
    if (res[2]) {
        var ul = document.getElementById("mainNav").innerHTML;
        var newUl = '<li><a href="" title="Ga naar Admin pagina" alt="Ga naar Admin pagina">Admin</a></li>';
        newUl += ul;
        document.getElementById("mainNav").innerHTML = newUl;
    }
});

socket.on("serverRegisterMessage", function (content) {
    var response = content;
    var res = response.split(":");
    if (res[0]) {
        registeredPlayer = res[0];
        document.getElementById("login").innerHTML = res[1];
        closeButton();
    }
    if (res[2]) {
        var ul = document.getElementById("mainNav").innerHTML;
        var newUl = '<li><a href="" title="Ga naar Admin pagina" alt="Ga naar Admin pagina">Admin</a></li>';
        newUl += ul;
        document.getElementById("mainNav").innerHTML = newUl;
    }
});
function getQueuesFromServer(){
    socket.emit('clientQueuesMessage', true);
}
function showMessage(obj) {
    var newMsg = document.createElement("div");
    newMsg.appendChild(document.createTextNode(obj.id + " said: " + obj.content));

    messages.insertBefore(newMsg, lastMsg)
    lastMsg = newMsg;
}

function loginTCP(name, pass) {
    socket.emit('clientLoginMessage', playerId + ":" + name + ":" + pass);
}

function registerTCP(name, pass) {
    socket.emit('clientRegisterMessage', playerId + ":" + name + ":" + pass);
}

function createGame(amount) {
    socket.emit('clientCreateGameMessage', playerId + ":" + amount);
}
function joinGame(idInstance) {
    socket.emit('clientJoinGameMessage', playerId + ":" + idInstance);
}


function save() {
    socket.emit('clientMessage', inpClient.value);
    inpClient.value = '';
}

function generateQueuesList(res){
    var p = "";
    p += '<div id="queue">';
    p += '<ul>';
    p += '<li class="header"><p><span>Mode</span></p><p>Spelers / Totaal</p><p></p></li>';
    for(i = 0; i < res.length-1;i++){
        if(res!= ""){
            var item = res[i].split(":");
            p += '<li class="item"><p><span>Normal</span></p><p>' + item[1] + ' / ' + item[2] + '</p><p class="join" id="join" title="JointInstance:' + i + '">Join</p></li>';
        }
        else{
            p += '<li class="item"><p><span></span></p><p>Geen spel beschikbaar</p><p></p></li>';
        }
    }
    p += '</ul>';
    p += '<p class="pButton" id="createGame">Create Game</p>';
    p += '</div>';
    document.getElementById("three").innerHTML = p;
    var creategame = document.getElementById("createGame");
    creategame.addEventListener("click", clickCreategame);
    var join = document.getElementById("join");
    if(join!=null) join.addEventListener("click", clickJoingame);
}

function clickCreategame(){
    createGame(3);
}

function clickJoingame(){
    var join = document.getElementById("join");
    var item = join.title.split(":");
    joinGame(item[1]);
}
