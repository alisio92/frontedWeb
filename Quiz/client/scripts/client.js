/**
 * Created by alisio on 18/11/2014.
 */
var socket = io.connect("http://localhost:4000");
var inpClient = document.getElementById('name');
var messages = document.getElementById('messages');
var btn = document.getElementById('send');
var lastMsg ; //div element met client message

btn.addEventListener("click", save);


function save(){
    socket.emit('clientMessage', inpClient.value);
    inpClient.value = '';
}

socket.on("serverMessage", function (json) {
    showMessage(JSON.parse(json));
})

function showMessage(obj) {
    var newMsg = document.createElement("div");
    newMsg.appendChild(document.createTextNode(obj.id + " said: " + obj.content));

    messages.insertBefore(newMsg, lastMsg)
    lastMsg = newMsg;
}
