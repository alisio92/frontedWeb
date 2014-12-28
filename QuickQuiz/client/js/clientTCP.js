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
var gameInstance = -1;

socket.on("serverMessage", function (json) {
    showMessage(JSON.parse(json));
});
socket.on("serverGiveNumberUsers", function (json) {
    document.getElementById("online").innerHTML = "Aantal gebruikers online: " + JSON.parse(json);
    init_database();
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
    generateQueuesList(res);
    var xAngle = 0, yAngle = 0;
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
        var newUl = '<li title="Ga naar Admin pagina" alt="Ga naar Admin pagina">Admin</li>';
        newUl += ul;
        document.getElementById("mainNav").innerHTML = newUl;
    }
    initButtons();
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
        var newUl = '<li title="Ga naar Admin pagina" alt="Ga naar Admin pagina">Admin</li>';
        newUl += ul;
        document.getElementById("mainNav").innerHTML = newUl;
    }
    initButtons();
});
socket.on("serverQueueIsFullMessage", function (content) {
    goToGame();
});
socket.on("serverQuestionMessage", function (content) {
    generateGame(content);
});
socket.on("serverGameInstanceMessage", function (content) {
    gameInstance = content;
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
    var queue = "";
    queue += '<div id="queue">';
    queue += '<ul>';
    queue += '<li class="header"><p><span>Mode</span></p><p>Spelers / Totaal</p><p></p></li>';
    for(i = 0; i < res.length-1;i++){
        if(res!= ""){
            var item = res[i].split(":");
            queue += '<li class="item"><p><span>Normal</span></p><p>' + item[1] + ' / ' + item[2] + '</p><p class="join" id="join" title="JointInstance:' + i + '">Join</p></li>';
        }
        else{
            queue += '<li class="item"><p><span></span></p><p>Geen spel beschikbaar</p><p></p></li>';
        }
    }
    queue += '</ul>';
    queue += '<p class="pButton" id="createGame">Nieuw Host</p>';
    queue += '</div>';
    document.getElementById("three").innerHTML = queue;
    var creategame = document.getElementById("createGame");
    creategame.addEventListener("click", clickCreategame);
    var join = document.getElementById("join");
    if(join!=null) join.addEventListener("click", clickJoingame);
}
function clickCreategame(){
    createGame(4);
}
function clickJoingame(){
    var join = document.getElementById("join");
    var item = join.title.split(":");
    gameInstance = item[1];
    joinGame(gameInstance);
}
function initButtons(){
    var register = document.getElementById("register");
    register.addEventListener("click", clickRegisterWindow);
    var login = document.getElementById("login");
    login.addEventListener("click", clickLoginWindow);
}
function goToGame(){
    var rot = document.getElementById('cube').style[propTCP];
    var xAngle = 0, yAngle = 0;
    xAngle -= 90;
    document.getElementById('cube').style[propTCP] = "rotateX(" + xAngle + "deg) rotateY(" + yAngle + "deg)";
    readyGame();
}
function readyGame(){
    socket.emit('clientReadyMessage', playerId + ":" + gameInstance);
}
function generateGame(content){
    var res = content.split(";");
    var game = "";
    game += '<img src="' + res[0] + '" width="100%" height="500px"/>';
    game += '<p>1</p><p>2</p><p>3</p><p>4</p>';
    document.getElementById("one").innerHTML = game;
}
