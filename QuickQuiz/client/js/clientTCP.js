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
var admin = false;
var timer = 0;
var joinedQueue = false;
var joinedQueueMessage = false;
var questionIndex = -1;
var hint = false;
var playerName = "";
var chatMessage = [];
var map;
var XLocation = 0;
var YLocation = 0;
var showHint = false;

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
socket.on("serverUpdateScoreMessage", function (content) {
    var res = content.split(":");
    var scores = "";
    for(i=0;i<res.length;i++){
        scores+= '<p>' + res[i] + '</p>';
    }
    document.getElementById("otherUsers").innerHTML = scores;
});
socket.on("serverGameInstanceMessage", function (content) {
    gameInstance = content;
});
socket.on("serverChatMessage", function (content) {
    var res = content.split(":");
    updateChat(res[0], res[1], res[2], res[3]);
});
socket.on("serverAdminGetGameMessage", function (content) {
    var res = content.split(':');
    setAdminScreen(res[0], res[1]);
});
socket.on("serverQuestionFinishedMessage", function (content) {
    var res = content.split(":");
    var scores = "";
    for(i=0;i<res.length;i++){
        scores+= '<p>' + res[i] + '</p>';
    }
    scores += '<button type="button" id="closeScore">X</button>';
    document.getElementById("scoreMessage").innerHTML = scores;
    document.getElementById("scoreMessage").style.visibility = "visible";
    var rot = document.getElementById('cube').style[propTCP];
    var xAngle = 0, yAngle = 0;
    document.getElementById('cube').style[propTCP] = "rotateX(" + xAngle + "deg) rotateY(" + yAngle + "deg)";
    var closeScore = document.getElementById("closeScore");
    if(closeScore!=null) closeScore.addEventListener("click", clickcloseScore);
    /*var goToQueue = document.getElementById("goToQueue");
    if(goToQueue!=null) goToQueue.addEventListener("click", clickgoToQueue2);
    var goToQueueSingle = document.getElementById("singleQueue");
    if(goToQueueSingle!=null) goToQueueSingle.addEventListener("click", clickgoToQueueSingle2);
    var chat = document.getElementById("chatButton");
    if(chat!=null) chat.addEventListener("click", clickchat2);*/
});
function clickcloseScore(){
    document.getElementById("scoreMessage").innerHTML = "";
    document.getElementById("scoreMessage").style.visibility = "hidden";
}
function setAdminScreen(player, game){
    var rot = document.getElementById('cube').style[propTCP];
    var xAngle = 0, yAngle = 0;
    yAngle += 90;
    document.getElementById('cube').style[propTCP] = "rotateX(" + xAngle + "deg) rotateY(" + yAngle + "deg)";

    var adminScreen = '';
    adminScreen+= '<p>Aantal spelers: ' + player + '</p>';
    if(game!="undefined") adminScreen+= '<p>Aantal games: ' + game + '</p>';
    adminScreen+= '<input type="button" id="returnButton" value="Keer Terug"/>';
    document.getElementById('five').innerHTML = adminScreen;
    var returnButton = document.getElementById("returnButton");
    if(returnButton!=null) returnButton.addEventListener("click", clickreturnButton);
}
function clickreturnButton(){
    var rot = document.getElementById('cube').style[propTCP];
    var xAngle = 0, yAngle = 0;
    document.getElementById('cube').style[propTCP] = "rotateX(" + xAngle + "deg) rotateY(" + yAngle + "deg)";
}
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
    createGame(4);
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
    socket.emit('clientAdminGetGameMessage', true);

    /*var adminView = "";
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
    if (fButton != null) fButton.addEventListener("click", insert);*/
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
    showHint = false;
    var res = content.split(":");
    questionIndex = res[0];
    //document.getElementById("image").src = res[6];
    XLocation = res[7];
    YLocation = res[8];
    var game = "";
    game += '<canvas id="cnv">Your browser does not support the HTML5 canvas tag.</canvas>';
    game += '<p>' + res[0] + ": " + res[1] + '</p>';
    game += '<div class="questionItem" id="questionItem1"><img src="./images/red.png" width="25px" height="25px" title="' + res[2] + '" alt="' + res[2] + '"/> <p>' + res[2] + '</p></div>';
    game += '<div class="questionItem" id="questionItem2"><img src="./images/red.png" width="25px" height="25px" title="' + res[3] + '" alt="' + res[3] + '"/> <p>' + res[3] + '</p></div>';
    game += '<div class="questionItem" id="questionItem3"><img src="./images/red.png" width="25px" height="25px" title="' + res[4] + '" alt="' + res[4] + '"/> <p>' + res[4] + '</p></div>';
    game += '<div class="questionItem" id="questionItem4"><img src="./images/red.png" width="25px" height="25px" title="' + res[5] + '" alt="' + res[5] + '"/> <p>' + res[5] + '</p></div>';
    game += '<div id="hint"><button type="button" id="hintButton">Hint</button></div>';
    document.getElementById("gameQuestion").innerHTML = game;
    changeColor(res[6]);
    var questionItem1 = document.getElementById("questionItem1");
    if(questionItem1!=null) questionItem1.addEventListener("click", clickquestionItem1);
    var questionItem2 = document.getElementById("questionItem2");
    if(questionItem2!=null) questionItem2.addEventListener("click", clickquestionItem2);
    var questionItem3 = document.getElementById("questionItem3");
    if(questionItem3!=null) questionItem3.addEventListener("click", clickquestionItem3);
    var questionItem4 = document.getElementById("questionItem4");
    if(questionItem4!=null) questionItem4.addEventListener("click", clickquestionItem4);
    var hintButton = document.getElementById("hintButton");
    if(hintButton!=null) hintButton.addEventListener("click", clickhintButton);
    if(!showHint){
        document.getElementById("mapCanvas").innerHTML = "";
        document.getElementById("mapCanvas").style.visibility = "hidden";
        document.getElementById("mapCanvasmap-canvas").style.backgroundColor = "transparent";
    }
}
function clickquestionItem1(){
    socket.emit('clientNextQuestionMessage', playerName + ":" + gameInstance + ":" + questionIndex + ":" + 0);
}
function clickquestionItem2(){
    socket.emit('clientNextQuestionMessage', playerName + ":" + gameInstance + ":" + questionIndex + ":" + 1);
}
function clickquestionItem3(){
    socket.emit('clientNextQuestionMessage', playerName + ":" + gameInstance + ":" + questionIndex + ":" + 2);
}
function clickquestionItem4(){
    socket.emit('clientNextQuestionMessage', playerName + ":" + gameInstance + ":" + questionIndex + ":" + 3);
}
function clickhintButton(){
    showHint = true;
    document.getElementById("mapCanvas").style.visibility = "visible";
    document.getElementById("mapCanvas").style.backgroundColor = "#ffffff";
    initialize();
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
function sendChatMessage(chat){
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    socket.emit('clientChatMessage', playerName + ":" + h + ":" + m + ":" + chat);
}
function updateChat(name, hour, minute, message){
    chatMessage.push(name + " " + hour + ":" + minute);
    chatMessage.push(message);

    var chatNew = "";
    var start = 0;
    if(chatMessage.length>24) start = chatMessage.length-22;
    for(i = start; i < chatMessage.length;i++){
        chatNew += '<p>' + chatMessage[i] + '</p>';
    }

    document.getElementById("chatText").innerHTML = chatNew;
}
function changeColor(photo){
    var canvas = document.getElementById('cnv');
    var ctx = canvas.getContext('2d');
    var width = 250;
    var height = 250;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    var imageData = ctx.getImageData(0, 0, width, height);
    var pixelData = imageData.data;
    var bytesPerPixel = 4;
    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            if(y < height) {
                var startIdx = (y * bytesPerPixel * width) + (x * bytesPerPixel);
                var red = pixelData[startIdx];
                var green = pixelData[startIdx + 1];
                var blue = pixelData[startIdx + 2];
                var grayScale = (red * 0.3) + (green * 0.59) + (blue * .11);
                pixelData[startIdx] = grayScale;
                pixelData[startIdx + 1] = grayScale;
                pixelData[startIdx + 2] = grayScale;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    image.src = "./images/" + photo;
}
function initialize() {
    var mapOptions = {
        zoom: 6
    };
    var m = document.getElementById('mapCanvas');
    map = new google.maps.Map(m,
        mapOptions);

    // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(XLocation, YLocation);

            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Location found using HTML5.'
            });

            map.setCenter(pos);
        }, function() {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}
function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}
function clickchat2(){
    if(registeredPlayer){
        var chat = document.getElementById("chatinput").value;
        if(chat.length<100 && chat.length>0){
            sendChatMessage(chat);
            document.getElementById("chatinput").value = "";
        }
        else{

        }
    }
}
function clickgoToQueueSingle2(){
    if (registeredPlayer) {
        createGame(1);
    }
}
function clickgoToQueue2() {
    if (registeredPlayer) {
        getQueuesFromServer();
    }
}
//google.maps.event.addDomListener(window, 'load', initialize);
