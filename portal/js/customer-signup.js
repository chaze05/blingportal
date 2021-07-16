//  JS validation
//UI_URL= "http://localhost:8080/business/"
UI_URL = 'https://www.bling-center.com/business/';


/*

Adding new flow in the progress screens:

1. Create a div - ex -> addNewdiv
2. Add the div to screens list at appropriate index order
3. Create a method related to specific display options of the div
4. Add method name to function_calls list
5. Create a button with id -> progress_(index + 1)
6. add hide for above div under hide_all() method
7. function on what to do on clicking next under the div + add display_next_screen() if valid
*/

var selectedPlan = '';
var sessionId;
var signup_details = {
    'fullname':'',
    'email': '',
    'number': '',
    'address': '',
}

var plan_details = {
    'Basic': '5 calls per day',
    'Plus': '15 calls per day',
    'Pro': '30 calls per day',
    'Unlimited': 'Unlimited calls per day',
}

var current_screen_index = 0;
var next_screen_index = 1;
var in_progress_screen_index = 0;
var screens = ['selectplan', 'selectnumber', 'welcomemessagediv', 'offhourmessagediv', 'connectcalldiv', 'golivediv', 'processpayment']
var function_calls = [do_nothing,displayBlingNumber, display_welcome, display_voicemail,do_nothing, do_nothing, do_nothing]
var clicked_out_order = false
var updated_welcome = false
var updated_voicemail = false
// A reference to Stripe.js initialized with a fake API key.
// Sign in to see examples pre-filled with your key.
//var stripe = Stripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

$(document).ready(function () {
    var todaysDate = new Date();
    var year = todaysDate.getFullYear();
    var month = ("0" + (todaysDate.getMonth() + 1)).slice(-2);
    var day = ("0" + todaysDate.getDate()).slice(-2);
    var minDate = (year +"-"+ month +"-"+ day);

    hideAll();
    $('#startup').show();
    $('#selectplan').show();
    $('#welcome').hide();

    hideInterval = setInterval(function() {
            if ($('#nextbutton').length > 0) {
                clearInterval(hideInterval);
                $('#nextbutton').show();
            }
        }, 100)

    elements = document.getElementsByClassName('progress')

    for(i=0; i< elements.length; i++) {
        elements[i].disabled = true
    }

    // remove after testing
//    plan = document.getElementById('Pro')
//
//    signup_details['plan_name'] = "Pro Plan"
//    signup_details['plan_description'] = plan.nextElementSibling.innerHTML.replace("<p>","").replace("</p>","").replace(/\t|\n/g, "")
//    signup_details['plan_amount'] = plan.getElementsByTagName("span")[0].innerText.replace(/\t|\n/g, "")
//    display_next_screen();
//    display_next_screen();
//    display_next_screen();
//    display_next_screen();

    //next screen values
//    $('#callcount')[0].innerText = plan_details['Pro']
//    $('#calldescription')[0].innerText = signup_details['plan_description']
});

function do_nothing() {
    return
}

function hideAll() {
        $('#startup').hide();
        $('#gameplay').hide();
        $('#minPlans').hide();

        $('#selectplan').hide();
        $('#selectnumber').hide();
        $('#welcomemessagediv').hide();
        $('#offhourmessagediv').hide();
        $('#connectcalldiv').hide();
        $('#golivediv').hide();
        $('#processpayment').hide();
        $('#loader').hide();
        $('#nextbutton').show();
        $('#callnow').hide();
        $('#schedulecall').hide();
        $('#welcome').show();
}

function display_next_screen() {
    console.log(signup_details)
    hideAll();
     $('#gameplay').show();
     $('#progress_' + current_screen_index).removeClass('progressclick')

     if (!clicked_out_order) {
        if (current_screen_index != in_progress_screen_index) {
            current_screen_index = in_progress_screen_index
        } else {
            current_screen_index = next_screen_index;
            in_progress_screen_index = next_screen_index;
            next_screen_index ++;
        }
     }
    screen_name = screens[current_screen_index]
    function_calls[current_screen_index]()
    $('#' + screen_name).show();
    document.getElementsByClassName('progress')[current_screen_index - 1].disabled = false
    clicked_out_order = false;
    $('#progress_' + current_screen_index).addClass('progressclick')
}

function validate() {
	const name = document.getElementById('name').value;
	const phone = document.getElementById('phone').value;
	const email = document.getElementById('email').value;
	const business = document.getElementById('business').value;
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

	if (business.length < 2) {
        text = 'Please Enter valid Business Name';
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
	    signup_details['fullname'] = $('#name')[0].value
	    signup_details['email'] = $('#email')[0].value
	    signup_details['number'] = $('#phone')[0].value
	    signup_details['business'] = $('#business')[0].value

        if (!updated_welcome) {
	        signup_details['welcome_message'] = "Thanks for calling "+$('#business')[0].value+ ". We will be right with you."
	    }

	    if (!updated_voicemail) {
	        signup_details['voicemail_message'] = "Thank you for calling "+$('#business')[0].value+ ". This is Meghan. Please leave a message and I will get back to you soon."
        }

//	    $('#signup-form').hide();
//	    $('#stripcheckout').show();
        updatePlan();
        display_next_screen();
	}
}

function updatePlan() {
     plan = document.getElementById(selectedPlan)

    signup_details['plan_name'] = selectedPlan + " Plan"
    signup_details['plan_description'] = plan.nextElementSibling.innerHTML.replace("<p>","").replace("</p>","").replace(/\t|\n/g, "")
    signup_details['plan_amount'] = plan.getElementsByTagName("span")[0].innerText.replace(/\t|\n/g, "")
    console.log(signup_details)

    //next screen values
    $('#callcount')[0].innerText = plan_details[selectedPlan]
    $('#calldescription')[0].innerText = signup_details['plan_description']
}

function addblingnumber(id) {
    signup_details['blingphonenumber'] = id
    display_next_screen();
}

function setwelcomemsg() {
    display_next_screen();
}

function setoffhourmsg() {
    display_next_screen();
}

function nextStep() {
    console.log("Next screen")
    switch(current_screen_index) {
        case 0: signUp();
            break;
        case 1: addblingnumber(0);
            break;
        case 2: setwelcomemsg();
            break;
        case 3: setoffhourmsg();
            break;
        case 4: connectToAgent();
            break;
        case 5: setgolivedate();
            break;
        case 6: processpayment();
            break;
    }
}


function selectplan(id) {
        $('#'+selectedPlan).removeClass("click");
        $('#'+ selectedPlan).addClass('plan hover')
        selectedPlan = id
        $('#'+ id).addClass('click')
        $('#'+ id).removeClass('plan hover')
}


function stripecheckout() {
    $('#loader').show();
    $('#loader-message')[0].innerText = "Checking you out :)"
    $('#stripcheckout').hide();

     $.ajax({
        type: 'post',
        url: UI_URL + 'checkoutsession',
        data: {lineitem: $('#lineitem')[0].innerText,
               amount: $('#amount')[0].innerText.replace("/month", "").replace("$", "")
          },
        success: function (data) {
            $('#loader').hide();
            $('#payment-form').show();
            sessionId = data['data']['id']
            console.log(data)
        },
        error: function(err) {
            $('#signup-error').show();
            $('#signup-form').show();
            console.log(err)
        }
      });
}

function cancelcheckout() {
    $('#stripcheckout').hide();
    $('#error_message').hide();
    $('#signup-form').show();
}


function paynow() {

    $.ajax({
        type: 'post',
        url: UI_URL + 'paynow',
        data: {lineitem: $('#lineitem')[0].innerText,
               amount: $('#amount')[0].innerText.replace("/month", "").replace("$", "")
          },
        success: function (data) {
            $('#loader').hide();
            $('#payment-form').show();
            sessionId = data['data']['id']
            console.log(data)
        },
        error: function(err) {
            $('#signup-error').show();
            $('#signup-form').show();
            console.log(err)
        }
      });
}


function displayPlans() {
    $('#minPlans').show();
    $('#switchplanbutton').hide();
}

function canceldisplayplan() {
    $('#minPlans').hide();
    $('#switchplanbutton').show();
}

function switchplan(id) {
    selectedPlan = id.replace("Plan", "")
    updatePlan();
    canceldisplayplan();
}

function displayBlingNumber() {
    hideInterval = setInterval(function() {
        if ($('#nextbutton').length > 0) {
            clearInterval(hideInterval);
            $('#nextbutton').hide();
        }
    }, 100)
}

function display_welcome() {
    $('#currentwelcome')[0].value = signup_details['welcome_message']
}

function display_voicemail() {
    $('#currentvoicemail')[0].value = signup_details['voicemail_message']
}

function clickOutOrder(id) {
    $('#progress_' + current_screen_index).removeClass('progressclick')
    button_id = id.split("_")[1]
    clicked_out_order = true
    current_screen_index = parseInt(button_id)
    display_next_screen();
}

function listnumbers() {
    $('#getareacode').hide();
    $('#loader').show();
    document.getElementById('displaynumber').innerHTML = ""
    document.getElementById('displaynumber').style = ""
    $.ajax({
        type: 'post',
        url: UI_URL + 'list/phonenumber/',
        data: {email: signup_details['email'], areacode: $('#areacode')[0].value},
        success: function (data) {
            console.log(data)
            $('#getareacode').show();
            $('#areacode')[0].value = ""
            $('#loader').hide();
            document.getElementById('displaynumber').innerHTML = "<h4 class='blingfont' style='color: black'> Select a number: </h4>"
            document.getElementById('displaynumber').style = "margin-bottom: 30px;"

            for(i=0; i< data.length; i++) {
                div = document.createElement('div')
                div.style = "margin-top: 10px"
                div.innerHTML = "<Button class='btn btn-primary' id="+data[i]+" onclick=addblingnumber(this.id)>" + data[i] + "</Button>"
                document.getElementById('displaynumber').appendChild(div)
            }
        },
        error: function(err) {
            $('#getareacode').show();
            $('#loader').hide();
            console.log(err)
        }
      });
}

function updateGreeting() {
    signup_details['welcome_message'] = $('#greetingmessage')[0].value
    updated_welcome = true
    $('#currentwelcome')[0].innerHTML = $('#greetingmessage')[0].value
    $('#greetingmessage')[0].value = ""
}

function updateVoicemail() {
    signup_details['voicemail_message'] = $('#voicemailmessage')[0].value
    updated_voicemail = true
    $('#currentvoicemail')[0].innerHTML = $('#voicemailmessage')[0].value
    $('#voicemailmessage')[0].value = ""
}

//fetch("/create-payment-intent", {
//  method: "POST",
//  headers: {
//    "Content-Type": "application/json"
//  },
//  body: JSON.stringify(purchase)
//})
//  .then(function(result) {
//    return result.json();
//  })
//  .then(function(data) {
//    var elements = stripe.elements();
//
//    var style = {
//      base: {
//        color: "#32325d",
//        fontFamily: 'Arial, sans-serif',
//        fontSmoothing: "antialiased",
//        fontSize: "16px",
//        "::placeholder": {
//          color: "#32325d"
//        }
//      },
//      invalid: {
//        fontFamily: 'Arial, sans-serif',
//        color: "#fa755a",
//        iconColor: "#fa755a"
//      }
//    };
//
//    var card = elements.create("card", { style: style });
//    // Stripe injects an iframe into the DOM
//    card.mount("#card-element");
//
//    card.on("change", function (event) {
//      // Disable the Pay button if there are no card details in the Element
//      document.querySelector("button").disabled = event.empty;
//      document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
//    });
//
//    var form = document.getElementById("payment-form");
//    form.addEventListener("submit", function(event) {
//      event.preventDefault();
//      // Complete payment when the submit button is clicked
//      payWithCard(stripe, card, data.clientSecret);
//    });
//  });
//
//// Calls stripe.confirmCardPayment
//// If the card requires authentication Stripe shows a pop-up modal to
//// prompt the user to enter authentication details without leaving your page.
//var payWithCard = function(stripe, card, clientSecret) {
//  loading(true);
//  stripe
//    .confirmCardPayment(clientSecret, {
//      payment_method: {
//        card: card
//      }
//    })
//    .then(function(result) {
//      if (result.error) {
//        // Show error to your customer
//        showError(result.error.message);
//      } else {
//        // The payment succeeded!
//        orderComplete(result.paymentIntent.id);
//      }
//    });
//};
//
///* ------- UI helpers ------- */
//
//// Shows a success message when the payment is complete
//var orderComplete = function(paymentIntentId) {
//  loading(false);
//  document
//    .querySelector(".result-message a")
//    .setAttribute(
//      "href",
//      "https://dashboard.stripe.com/test/payments/" + paymentIntentId
//    );
//  document.querySelector(".result-message").classList.remove("hidden");
//  document.querySelector("button").disabled = true;
//};
//
//// Show the customer the error from Stripe if their card fails to charge
//var showError = function(errorMsgText) {
//  loading(false);
//  var errorMsg = document.querySelector("#card-error");
//  errorMsg.textContent = errorMsgText;
//  setTimeout(function() {
//    errorMsg.textContent = "";
//  }, 4000);
//};
//
//// Show a spinner on payment submission
//var loading = function(isLoading) {
//  if (isLoading) {
//    // Disable the button and show a spinner
//    document.querySelector("button").disabled = true;
//    document.querySelector("#spinner").classList.remove("hidden");
//    document.querySelector("#button-text").classList.add("hidden");
//  } else {
//    document.querySelector("button").disabled = false;
//    document.querySelector("#spinner").classList.add("hidden");
//    document.querySelector("#button-text").classList.remove("hidden");
//  }
//};
