//  JS validation
UI_URL= "http://localhost:8080/business/"
//UI_URL = 'https://www.bling-center.com/business/';

var selectedPlan = '';

$(document).ready(function () {
    var todaysDate = new Date();
    var year = todaysDate.getFullYear();
    var month = ("0" + (todaysDate.getMonth() + 1)).slice(-2);
    var day = ("0" + todaysDate.getDate()).slice(-2);
    var minDate = (year +"-"+ month +"-"+ day);
    document.getElementById("startdate").min = minDate;
    document.getElementById("startdate").value = minDate;
//    $('#startdate').data("DateTimePicker").minDate(minDate)
    $('#loader').hide();
    $('#signup-success').hide();
    $('#signup-error').hide();
    $('#stripcheckout').hide();
});

function validate() {
	const name = document.getElementById('name').value;
	const phone = document.getElementById('phone').value;
	const email = document.getElementById('email').value;
	const error_message = document.getElementById('error_message');

	error_message.style.padding = '10px';

	var text;
	if (name.length < 2) {
		text = 'Please Enter valid Name';
		error_message.innerHTML = text;
		return false;
	}

	if (email.indexOf('@') == -1 || email.length < 6) {
		text = 'Please Enter valid Email';
		error_message.innerHTML = text;
		return false;
	}
	if (isNaN(phone) || phone.length != 10) {
		text = 'Please Enter valid Phone Number';
		error_message.innerHTML = text;
		return false;
	}

	if (selectedPlan == '') {
        text = 'Please Select a Plan';
        error_message.innerHTML = text;
        return false;
    }
	return true;
}

function signUp() {
    $('#signup-error').hide();
	const valid = validate();
	if (valid) {
	    $('#signup-form').hide();
	    $('#stripcheckout').show();

//		 $.ajax({
//            type: 'post',
//            url: UI_URL + 'new/customer',
//            data: {name: $('#name')[0].value,
//                   phoneNumber: $('#phone')[0].value,
//                   email: $('#email')[0].value,
//                   plan: "Inbound " + selectedPlan
//              },
//            success: function (data) {
//                $('#loader').hide();
//                $('#signup-success').show();
//            },
//            error: function(err) {
//                $('#signup-error').show();
//                $('#signup-form').show();
//            }
//          });
	}
}

function selectplan(id) {
        $('#'+selectedPlan).removeClass("click");
        $('#'+ selectedPlan).addClass('plan hover')
        selectedPlan = id
        $('#'+ id).addClass('click')
        $('#'+ id).removeClass('plan hover')
}

function back() {
    window.location.href='businesslist_v3.html'
}

function stripecheckout() {
    $('#loader').show();
    $('#stripcheckout').hide();

     $.ajax({
        type: 'post',
        url: UI_URL + 'checkoutsession',
        data: {lineitem: 'Pro Pla',
               amount: '99'
          },
        success: function (data) {
            $('#loader').hide();
            $('#signup-success').show();
            console.log(data)
        },
        error: function(err) {
            $('#signup-error').show();
            $('#signup-form').show();
            console.log(err)
        }
      });
}