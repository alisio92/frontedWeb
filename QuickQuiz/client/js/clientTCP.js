/**
 * Created by alisio on 30/11/2014.
 */
var socket = io.connect("http://192.168.1.2:4000");
var inpClient = document.getElementById('name');
var messages = document.getElementById('messages');
var btn = document.getElementById('send');
var lastMsg; //div element met client message
var playerId = -1;
var registeredPlayer = false;
var propTCP = null;
var gameInstance = -1;
var admin = false;
var timer = 0;
var joinedQueue = false;
var joinedQueueMessage = false;
var questionIndex = -1;
var hint = false;
var playerName = "";

socket.on("serverMessage", function (json) {
    showMessage(JSON.parse(json));
});
socket.on("serverGiveNumberUsers", function (json) {
    document.getElementById("online").innerHTML = "Aantal gebruikers online: " + JSON.parse(json);
});
socket.on("serverClientIdName", function (content) {
    var res = content.split(":");
    playerId = res[0];
    playerName = res[1];
});
socket.on("serverQueuesMessage", function (content) {
    var response = content;
    var res = response.split(";");
    generateQueuesList(res);
});
socket.on("serverInsertMessage", function (content) {
    var rot = document.getElementById('cube').style[propTCP];
    var xAngle = 0, yAngle = 0;
    document.getElementById('cube').style[propTCP] = "rotateX(" + xAngle + "deg) rotateY(" + yAngle + "deg)";
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
    if (res[0] == "true") {
        registeredPlayer = res[0];
        document.getElementById("login").innerHTML = res[1];
        closeButton();
        document.getElementById("goToQueue").style.visibility = "visible";
        document.getElementById("singleQueue").style.visibility = "visible";
    } else {
        document.getElementById("name").style.borderColor = "red";
        document.getElementById("pass1").style.borderColor = "red";
        document.getElementById("formMessage").innerHTML = "Naam en/of wachtwoord is niet correct.";
    }
    if (res[2] == "true" && !admin) {
        admin = true;
        var ul = document.getElementById("mainNav").innerHTML;
        var newUl = '<li id="admin" title="Ga naar Admin pagina" alt="Ga naar Admin pagina">Admin</li>';
        newUl += ul;
        document.getElementById("mainNav").innerHTML = newUl;
    } else admin = false;
    initButtons();
});
socket.on("serverLogoutMessage", function (content) {
    if (content) {
        registeredPlayer = false;
        if (document.getElementById("admin") != null) document.getElementById("admin").remove();
        document.getElementById("login").innerHTML = "login";
        closeButton();
        document.getElementById("goToQueue").style.visibility = "hidden";
        document.getElementById("singleQueue").style.visibility = "hidden";
    }
});
socket.on("serverRegisterMessage", function (content) {
    var response = content;
    var res = response.split(":");
    if (res[0] == "true") {
        registeredPlayer = res[0];
        document.getElementById("login").innerHTML = res[1];
        closeButton();
        document.getElementById("goToQueue").style.visibility = "visible";
        document.getElementById("singleQueue").style.visibility = "visible";
    } else {
        document.getElementById("name").style.borderColor = "red";
        document.getElementById("formMessage").innerHTML = "Naam bestaat al.";
    }
    if (res[2] == "true" && !admin) {
        admin = true;
        var ul = document.getElementById("mainNav").innerHTML;
        var newUl = '<li id="admin" title="Ga naar Admin pagina" alt="Ga naar Admin pagina">Admin</li>';
        newUl += ul;
        document.getElementById("mainNav").innerHTML = newUl;
    } else admin = false;
    initButtons();
});
socket.on("serverQueueIsFullMessage", function (content) {
    timer = 60;
    joinedQueueMessage = true;
    showJoinMessage();
});
socket.on("serverSinglePlayer", function (content) {
    goToGame();
});
socket.on("serverEveryoneReadyMessage", function (content) {
    document.getElementById('joinMessage').innerHTML = '';
    goToGame();
});
socket.on("serverOnline", function (content) {
    socket.emit('clientOnline', playerId);
});
socket.on("serverQuestionMessage", function (content) {
    generateGame(content);
});
socket.on("serverGameInstanceMessage", function (content) {
    gameInstance = content;
});
function getQueuesFromServer() {
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
function logoutTCP(name, pass) {
    socket.emit('clientLogoutMessage', playerId + ":" + playerName);
}
function registerTCP(name, pass) {
    socket.emit('clientRegisterMessage', playerId + ":" + name + ":" + pass);
}
function createGame(amount) {
    socket.emit('clientCreateGameMessage', playerId + ":" + playerName + ":" + amount);
}
function joinGame(idInstance) {
    socket.emit('clientJoinGameMessage', playerId + ":" + playerName + ":" + idInstance);
}
function save() {
    socket.emit('clientMessage', inpClient.value);
    inpClient.value = '';
}
function generateQueuesList(res) {
    var queue = "";
    queue += '<div id="queue">';
    queue += '<ul>';
    queue += '<li class="header"><p><span>Mode</span></p><p>Spelers / Totaal</p><p></p></li>';
    for (i = 0; i < res.length - 1; i++) {
        if (res != "") {
            var item = res[i].split(":");
            queue += '<li class="item"><p><span>Normal</span></p><p>' + item[1] + ' / ' + item[2] + '</p><p class="join" id="join" title="JointInstance:' + i + '">Join</p></li>';
        }
        else {
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
    if (join != null) join.addEventListener("click", clickJoingame);
}
function clickCreategame() {
    createGame(2);
}
function clickJoingame() {
    var join = document.getElementById("join");
    var item = join.title.split(":");
    gameInstance = item[1];
    joinGame(gameInstance);
}
function initButtons() {
    var register = document.getElementById("register");
    register.addEventListener("click", clickRegisterWindow);
    var login = document.getElementById("login");
    login.addEventListener("click", clickLoginWindow);
    var admin = document.getElementById("admin");
    if (admin != null) admin.addEventListener("click", clickAdminWindow);
}
function clickAdminWindow() {
    var rot = document.getElementById('cube').style[propTCP];
    var xAngle = 0, yAngle = 0;
    yAngle += 90;
    document.getElementById('cube').style[propTCP] = "rotateX(" + xAngle + "deg) rotateY(" + yAngle + "deg)";


    var adminView = "";
    adminView += '<div id="errorMessage"></div>';
    adminView += "<form method='post' id='adminForm'>";
    adminView += "<label for='fQuestion'>Vraag:</label>";
    adminView += "<input type='text' id='fQuestion' required/>";
    adminView += "<label for='foption1'>Optie 1:</label>";
    adminView += "<input type='text' id='foption1' required/>";
    adminView += "<label for='foption2'>Optie 2:</label>";
    adminView += "<input type='text' id='foption2' required/>";
    adminView += "<label for='foption3'>Optie 3:</label>";
    adminView += "<input type='text' id='foption3' required/>";
    adminView += "<label for='foption4'>Optie 4:</label>";
    adminView += "<input type='text' id='foption4' required/>";
    adminView += "<label for='fCorrect'>Correct:</label>";
    adminView += "<input type='text' id='fCorrect' required/>";
    adminView += "<label for='fImg'>Image:</label>";
    adminView += "<input type='text' id='fImg' required/>";
    adminView += "<input type='button' id='fButton' value='Toevoegen'/>";
    adminView += "</form>";
    document.getElementById('five').innerHTML = adminView;
    var fButton = document.getElementById("fButton");
    if (fButton != null) fButton.addEventListener("click", insert);
}
function insert() {
    var fQuestion = document.getElementById("fQuestion").value;
    var foption1 = document.getElementById("foption1").value;
    var foption2 = document.getElementById("foption2").value;
    var foption3 = document.getElementById("foption3").value;
    var foption4 = document.getElementById("foption4").value;
    var fCorrect = document.getElementById("fCorrect").value;
    var fImg = document.getElementById("fImg").value;
    if (fQuestion != "" && foption1 != "" && foption2 != "" && foption3 != "" && foption4 != "" && fCorrect != "" && fImg != "") {
        socket.emit('clientInsertMessage', fQuestion + ":" + foption1 + ":" + foption2 + ":" + foption3 + ":" + foption4 + ":" + fCorrect + ":" + fImg);
    } else document.getElementById("errorMessage").innerHTML = "Niet alle velden zijn ingevuld!";
}
function goToGame() {
    var rot = document.getElementById('cube').style[propTCP];
    var xAngle = 0, yAngle = 0;
    xAngle -= 90;
    document.getElementById('cube').style[propTCP] = "rotateX(" + xAngle + "deg) rotateY(" + yAngle + "deg)";
    readyGame();
}
function readyGame() {
    socket.emit('clientReadyMessage', playerId + ":" + gameInstance);
}
function generateGame(content) {
    joinedQueueMessage = false;
    var res = content.split(":");
    questionIndex = res[0];
    var game = "";
    game += '<div id="gameQuestion">';
    game += '<img src="' + res[6] + '" width="250px" height="250px"/>';
    game += '<p>' + res[1] + '</p>';
    game += '<input type="button" id="a1" value="' + res[2] + '"/>';
    game += '<input type="button" id="a2" value="' + res[3] + '"/>';
    game += '<input type="button" id="a3" value="' + res[4] + '"/>';
    game += '<input type="button" id="a4" value="' + res[5] + '"/>';
    game += '</div>';
    document.getElementById("one").innerHTML = game;
}
function showJoinMessage() {
    if (joinedQueueMessage) {
        setInterval(function () {
            if (joinedQueueMessage) {
                var content = "";
                if (timer > 0) {
                    content += '<p>Spel start in ' + timer + 's</p>';
                    if (!joinedQueue) content += '<input type="button" id="joinButton" value="Join"/>';
                    document.getElementById('joinMessage').innerHTML = content;
                    var join = document.getElementById("joinButton");
                    if (join != null) join.addEventListener("click", startGame);
                    if (timer > 0) timer--;
                } else {
                    joinedQueueMessage = false;
                    document.getElementById('joinMessage').innerHTML = content;
                }
            }
        }, 1000);
    }
}
function startGame() {
    socket.emit('clientStartGameMessage', playerId + ":" + gameInstance);
    joinedQueue = true;
}
