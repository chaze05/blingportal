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
            url: 'http://localhost:8080/business/login',
            data: {username: $('#username')[0].value, password: $('#password')[0].value},
            success: function (data) {
             console.log(data)
             console.log("Hello Mallika");
             $("#loader").hide()
             $("#unauth").hide()
             window.location = "businesslist.html";
            },
            error: function(err) {
                console.log(err)
                $("#loader").hide()
                $("#unauth").show()
            }
          });
    };

