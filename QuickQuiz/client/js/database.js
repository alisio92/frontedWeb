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
        }
    });
};