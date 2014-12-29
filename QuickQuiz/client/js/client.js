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
    goToQueue.addEventListener("click", clickgoToQueue);
    fadeOutAnimation();

    var colorCircle = document.getElementById('test');
}
function clickgoToQueue() {
    if (registeredPlayer) {
        propTCP = prop;
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
    if (showLogin) Name = "Login";
    if (showRegister || (showLogin && !registeredPlayer)) {
        Form += '<div id="window">';
        Form += '<form method="post">';
        Form += '<fieldset><legend>' + Name + '</legend></fieldset>';
        Form += '<button type="button" id="close">X</button>';
        Form += '<label for="name">Naam:</label>';
        Form += '<input type="text" name="name" id="name" title="name" placeholder="Vul hier uw naam in" required/>';
        Form += '<label for="pass1">Paswoord:</label>';
        Form += '<input type="password" name="pass1" id="pass1" placeholder="Vul hier uw paswoord in" title="pass1" required/>';
    }
    if (showRegister) {
        Form += '<label for="pass2">Paswoord Controle:</label>';
        Form += '<input type="password" name="pass2" id="pass2" placeholder="Vul hier opnieuw uw paswoord in" title="pass2" required/>';
    }
    if (showRegister || (showLogin && !registeredPlayer)) {
        Form += '<button type="button" id="' + Name + 'Button" name="' + Name + 'Button">' + Name + '</button>';
        Form += '</form>';
        Form += '</div>';
    }
    document.getElementById("registration").innerHTML = Form;
    if (showRegister || (showLogin && !registeredPlayer)) {
        document.getElementById("name").focus();
        var close = document.getElementById("close");
        close.addEventListener("click", closeButton);
    }
    if (showLogin && !registeredPlayer) {
        var login = document.getElementById("LoginButton");
        login.addEventListener("click", clickLoginApp);
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
function clickRegisterApp() {
    var name = document.getElementById("name");
    var pass1 = document.getElementById("pass1");
    var pass2 = document.getElementById("pass2");
    if (pass1.value == pass2.value) registerTCP(name.value, pass1.value);
    else alert("pass1 != pass2");
}
