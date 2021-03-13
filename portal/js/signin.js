//UI_URL= "http://localhost:8080/business/"
UI_URL = "https://www.bling-center.com/business/"


$(document).ready(function() {
$("#loader").hide()
$("#unauth").hide()
$("#emailmissing").hide()
$("#passwordmissing").hide()
});

function auth() {
        console.log("Hello Malika")
        missflag = false
        if ($("#username")[0].value == "") {
            missflag = true
            $("#emailmissing").show()
        }

        if ($("#password")[0].value == "") {
            missflag = true
            $("#passwordmissing").show()
        }

        if (missflag) {
            return
        }

        $("#loader").show()
        $("#passwordmissing").hide()
        $("#emailmissing").hide()
          $.ajax({
            type: 'post',
            url: UI_URL + 'login',
            data: {username: $('#username')[0].value, password: $('#password')[0].value},
            success: function (data) {
             console.log(data)
             console.log("Hello Mallika");
             $("#loader").hide()
             $("#unauth").hide()
             window.location = "businesslist_v2.html";
            },
            error: function(err) {
                console.log(err)
                $("#loader").hide()
                $("#unauth").show()
            }
          });
    };

