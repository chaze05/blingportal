function auth() {

}

$(document).ready(function() {
//var form = document.getElementById("myForm");
//function handleForm(event) { event.preventDefault(); }
//form.addEventListener('submit', handleForm);
$('#load').hide()

$(function () {
    $('#myForm').on('submit',function (e) {
            $('#load').show()
              $.ajax({
                type: 'post',
                url: 'http://localhost:8080/business/login',
                data: {username: $('#username'), password: $('#password')},
                success: function (data) {
                 console.log(data)
                  return false
                }
              });
//          e.preventDefault();
        });
});

});

