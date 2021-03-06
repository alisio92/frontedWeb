/**
 * Created by alisio on 14/12/2014.
 */
document.addEventListener("DOMContentLoaded", init);
var showLogin = false;
var showRegister = false;
var props = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
    prop,
    el = document.createElement('div');

for (var i = 0, l = props.length; i < l; i++) {
    if (typeof el.style[props[i]] !== "undefined") {
        prop = props[i];
        break;
    }
}
function init() {
    var register = document.getElementById("register");
    register.addEventListener("click", clickRegisterWindow);
    var login = document.getElementById("login");
    login.addEventListener("click", clickLoginWindow);
    var goToQueue = document.getElementById("goToQueue");
    if(goToQueue!=null) goToQueue.addEventListener("click", clickgoToQueue);
    var goToQueueSingle = document.getElementById("singleQueue");
    if(goToQueueSingle!=null) goToQueueSingle.addEventListener("click", clickgoToQueueSingle);
    var chat = document.getElementById("chatButton");
    if(chat!=null) chat.addEventListener("click", clickchat);
    fadeOutAnimation();
    propTCP = prop;
}
function clickchat(){
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
function clickgoToQueueSingle(){
    if (registeredPlayer) {
        createGame(1);
    }
}
function clickgoToQueue() {
    if (registeredPlayer) {
        getQueuesFromServer();
    }
}
function clickRegisterWindow() {
    showRegister = true;
    showLogin = false;
    showForm();
    fadeInAnimation();
}
function clickLoginWindow() {
    showLogin = true;
    showRegister = false;
    showForm();
    fadeInAnimation();
}
function fadeInAnimation(){
    var registration = document.getElementById("registration");
    registration.style.opacity = 1;
    registration.style.marginTop = 10 + "px";
    registration.style.transition = "margin .30s linear, opacity .08s linear";
}
function closeButton() {
    showRegister = false;
    showLogin = false;
    fadeOutAnimation();
}
function fadeOutAnimation() {
    var registration = document.getElementById("registration");
    registration.style.opacity = 0;
    registration.style.marginTop = -350 + "px";
    registration.style.transition = "margin .30s linear, opacity .08s linear";
    ["transitionend", "webkitTransitionEnd", "mozTransitionEnd"].forEach(function(transition) {
        document.addEventListener(transition, handler, false);
    });
    function handler() {
        showForm();
    }
}
function showForm() {
    var Name, Form = "";
    if (showRegister) Name = "Registreren";
    if (showLogin && !registeredPlayer) Name = "Login";
    if (showLogin && registeredPlayer) Name = "Logout";
    if (showRegister || (showLogin && !registeredPlayer)) {
        Form += '<div id="window">';
        Form += '<form method="post">';
        Form += '<fieldset><legend>' + Name + '</legend></fieldset>';
        Form += '<button type="button" id="close">X</button>';
        Form += '<label id="formMessage"></label>';
        Form += '<label for="name">Naam:</label>';
        Form += '<input type="text" name="name" id="name" title="name" placeholder="Vul hier uw naam in" required/>';
        Form += '<label for="pass1">Paswoord:</label>';
        Form += '<input type="password" name="pass1" id="pass1" placeholder="Vul hier uw paswoord in" title="pass1" required/>';
    }
    if (showLogin && registeredPlayer) {
        Form += '<div id="window">';
        Form += '<form method="post">';
        Form += '<fieldset><legend>' + Name + '</legend></fieldset>';
        Form += '<button type="button" id="close">X</button>';
        Form += '<label id="formMessage" class="error"></label>';
    }
    if (showRegister) {
        Form += '<label for="pass2">Paswoord Controle:</label>';
        Form += '<input type="password" name="pass2" id="pass2" placeholder="Vul hier opnieuw uw paswoord in" title="pass2" required/>';
    }
    if (showRegister || (showLogin)) {
        Form += '<button type="button" id="' + Name + 'Button" name="' + Name + 'Button">' + Name + '</button>';
        Form += '</form>';
        Form += '</div>';
    }
    document.getElementById("registration").innerHTML = Form;
    if (showRegister || (showLogin && !registeredPlayer)) {
        document.getElementById("name").focus();
    }
    if(showLogin || showRegister){
        var close = document.getElementById("close");
        close.addEventListener("click", closeButton);
    }
    if (showLogin && !registeredPlayer) {
        var login = document.getElementById("LoginButton");
        login.addEventListener("click", clickLoginApp);
    }
    if (showLogin && registeredPlayer) {
        var logout = document.getElementById("LogoutButton");
        logout.addEventListener("click", clickLogoutApp);
    }
    if (showRegister) {
        var Register = document.getElementById("RegistrerenButton");
        Register.addEventListener("click", clickRegisterApp);
    }
}
function clickLoginApp() {
    var name = document.getElementById("name");
    var pass1 = document.getElementById("pass1");
    loginTCP(name.value, pass1.value);
}
function clickLogoutApp() {
    logoutTCP();
}
function clickRegisterApp() {
    var name = document.getElementById("name");
    var pass1 = document.getElementById("pass1");
    var pass2 = document.getElementById("pass2");
    if (pass1.value == pass2.value) {
        if(name.value.length >= 2){
            if(pass1.value.length >= 6) registerTCP(name.value, pass1.value);
            else{
                document.getElementById("pass1").style.borderColor = "red";
                document.getElementById("formMessage").innerHTML = "Wachtwoord moet minstens 6 karakters hebben.";
            }
        }
        else {
            document.getElementById("name").style.borderColor = "red";
            document.getElementById("formMessage").innerHTML = "Naam moet minstens 2 karakters hebben.";
        }
    }
    else {
        document.getElementById("pass1").style.borderColor = "red";
        document.getElementById("pass2").style.borderColor = "red";
        document.getElementById("formMessage").innerHTML = "Wachtwoorden komen niet overeen.";
        //alert("pass1 != pass2");
    }
}
