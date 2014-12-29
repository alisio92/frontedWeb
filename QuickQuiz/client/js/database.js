/**
 * Created by alisio on 28/12/2014.
 */
function init_database() {
    $.ajax({
        url: "php/connection.php",
        type: "POST",
        data: "init=true",
        success: function (msg) {
            alert(msg);
            if(msg == 1) return true
        }
    });
    return false;
};

function create_user(name, pass) {
    $.ajax({
        url: "php/connection.php",
        type: "POST",
        data: "createUser=true, name=" + name + ", pass = " + pass + "",
        success: function (msg) {
            alert(msg);
            if(msg == 1) return true
        }
    });
    return false;
};

function check_user_exsists(name, pass) {
    $.ajax({
        url: "php/connection.php",
        type: "POST",
        data: "checkUserExists=true, name=" + name + ", pass = " + pass + "",
        success: function (msg) {
            alert(msg);
            if(msg == 1) return true
        }
    });
    return false;
};