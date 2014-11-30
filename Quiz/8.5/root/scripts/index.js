/**
 * Created by alisio on 24/11/2014.
 */
document.addEventListener("DOMContentLoaded", init);
var showLogin = false;
var showRegister = false;

function init() {
    var register = document.getElementById("register");
    register.addEventListener("click", clickRegister);
    var login = document.getElementById("login");
    login.addEventListener("click", clickLogin);
}
function clickRegister(){
    showRegister = true;
    showLogin = false;
    showForm();
}
function clickLogin(){
    showLogin = true;
    showRegister = false;
    showForm();
}
function closeButton(){
    showRegister = false;
    showLogin = false;
    closeForm();
}
function closeForm(){
    var window = document.getElementById("window");
    window.style.opacity = 0;
    window.style.marginTop = -350+"px";
    window.style.transition = "margin .30s linear, opacity .30s linear";
    if( window.style.transition.finish) showForm();
    //document.getElementById("registration").innerHTML = "";
    //if(window.style.opacity == 0) showForm();
}
function showForm() {
    var Name, Form = "";
    if(showRegister) Name = "Registreren";
    if(showLogin) Name = "Login";
    if(showRegister || showLogin){
        Form += '<div id="window">';
        Form += '<form method="post">';
        Form += '<fieldset><legend>' + Name + '</legend></fieldset>';
        Form += '<button type="button" id="close" class="btn-primary"><i class="glyphicon glyphicon-eye-close"></i></button>';
        Form += '<label for="name">Naam:</label>';
        Form += '<input type="text" name="name" id="name" title="name" placeholder="Vul hier uw naam in" required/>';
        Form += '<label for="pass1">Paswoord:</label>';
        Form += '<input type="password" name="pass1" id="pass1" placeholder="Vul hier uw paswoord in" title="pass1" required/>';
    }
    if(showRegister) {
        Form += '<label for="pass2">Passwoord Controle:</label>';
        Form += '<input type="pasword" name="pass2" id="pass2" placeholder="Vul hier opnieuw uw paswoord in" title="pass2" required/>';
    }
    if(showRegister || showLogin){
        Form += '<button type="button" class="btn-primary" id="saveButton" ><i class="glyphicon glyphicon-asterisk">' + Name + '</i></button>';
        Form += '</form>';
        Form += '</div>';
    }
    document.getElementById("registration").innerHTML = Form;
    /*var window = document.getElementById("window");
    window.style.transition = "opacity 5.30s linear";
    window.style.opacity = 1;*/
    if(showRegister || showLogin){
        document.getElementById("name").focus();
        var close = document.getElementById("close");
        close.addEventListener("click", closeButton);
    }
}