//UI_URL= "http://localhost:8080/"
UI_URL = 'https://www.bling-center.com/';

$(document).ready(function () {
	$('#loader').hide();
	$('#unauth').hide();
	$('#emailmissing').hide();
	$('#passwordmissing').hide();
	$('#signupfirst').hide();
	$('#passwordmatchnot').hide();
	$('#failedupdate').hide();
});

function login() {
    $('#emailmissing').hide();
    $('#passwordmissing').hide();

	missflag = false;
	if ($('#username')[0].value == '') {
		missflag = true;
		$('#emailmissing').show();
	}

	if ($('#password')[0].value == '') {
		missflag = true;
		$('#passwordmissing').show();
	}

	if (missflag) {
		return;
	}

	$('#loader').show();
	$('#passwordmissing').hide();
	$('#emailmissing').hide();
	$.ajax({
		type: 'post',
		url: UI_URL + 'business/login',
		data: {
			username: $('#username')[0].value,
			password: $('#password')[0].value,
		},
		success: function (data) {
			console.log(data);
			$('#loader').hide();
			$('#unauth').hide();
			// window.location = 'businesslist_v2.html';
			if (data.data.status == 'New User') {
			    $('#signuprepeat').hide();
			    $('#signupfirst').show();
			    document.getElementById('emailval').innerHTML = "Email: " + $('#username')[0].value
			} else {
            			    window.location = 'businesslist_v3.html';
            			}
		},
		error: function (err) {
			console.log(err);
			$('#loader').hide();
			$('#unauth').show();
		},
	});
}


function updatepassword() {
    $('#emailmissing').hide();
    $('#passwordmissing').hide();
    $('#passwordmatchnot').hide();
    $('#unauth').hide();

    pass = $('#newpass')[0].value
    confirmpass = $('#confirmpass')[0].value

    if (pass != confirmpass) {
        $('#passwordmatchnot').show();
        return;
    }

	$('#loader').show();
	$.ajax({
		type: 'post',
		url: UI_URL + 'signin/update',
		data: {
			email: $('#username')[0].value,
			password: pass,
		},
		success: function (data) {
			console.log(data);
			$('#loader').hide();
			$('#unauth').hide();
			window.location = 'businesslist_v3.html';
		},
		error: function (err) {
			console.log(err);
			$('#loader').hide();
			$('#failedupdate').show();
		},
	});
}