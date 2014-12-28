/**
 * Created by alisio on 15/12/2014.
 */
function test() {
    /*jQuery.ajax({
     type: "POST",
     url: './inc/connection.inc',
     dataType: 'php',
     data: {functionname: 'init_database', arguments: []},

     success: function (obj, textstatus) {
     if (!('error' in obj)) {
     yourVariable = obj.result;
     }
     else {
     console.log(obj.error);
     }
     }
     });*/

    $.ajax({
        url: "php/connection.php",
        type: "POST",
        data: "init=true",
        success: function (msg) {
            alert(msg);
        }
    });
}
test();