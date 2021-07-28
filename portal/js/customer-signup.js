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
    'blingphonenumber': '',
    'add_on_plan': {},
    'welcome_message': '',
    'voicemail_message': ''
}

var plan_details = {
    'Basic': '199|200|CRM Updates ',
    'Plus': '349|300|Emails/Messages|CRM Updates',
    'Pro': '549|600|Emails/Messages|CRM Updates',
    'NoLimit': '999|1800|Emails/Messages|CRM Updates|Surveys/Feedbacks',
}

var not_included = {
    'Basic': 'Emails/Messages|Surveys/Feedbacks',
    'Plus': 'Surveys/Feedbacks',
    'Pro': 'Surveys/Feedbacks',
    'NoLimit': '',
}

var plan_count = {
    'Basic': '5 inbound calls per day',
    'Plus': '15 inbound calls per day',
    'Pro': '30 inbound calls per day',
    'NoLimit': '90 inbound calls per day',
}

var current_screen_index = -1;
var next_screen_index = 0;
var in_progress_screen_index = -1;
var screens = ['selectplan', 'selectnumber', 'welcomemessagediv', 'golivediv', 'processpayment']
var function_calls = [do_nothing,displayBlingNumber, display_welcome, golivedate, display_process_payment]
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

    var link = window.location.href.split("?")
//    console.log(link[1])
    updatePlan(link[1]);

    hideAll();
    $('#accountsuccess').hide();
//    golivedate();

    hideInterval = setInterval(function() {
            if ($('#nextbutton').length > 0) {
                clearInterval(hideInterval);
                $('#nextbutton').show();
            }
        }, 100)

    elements = document.getElementsByClassName('progress')

     // remove after testing
        plan = document.getElementById('Pro')

        signup_details['plan_name'] = "Pro Plan"
        signup_details['business'] = "Bling"

    for(i=0; i< elements.length; i++) {
        elements[i].disabled = true
    }

    display_next_screen();
//    nextStep()
});

function do_nothing() {
    return
}

function hideAll() {

        $('#selectplan').hide();
        $('#selectnumber').hide();
        $('#welcomemessagediv').hide();
        $('#offhourmessagediv').hide();
        $('#connectcalldiv').hide();
        $('#golivediv').hide();
        $('#processpayment').hide();
        $('#loader').hide();
        $('#nextbutton').show();
        $('#nextbutton')[0].disabled = false
        $('#callnow').hide();
        $('#schedulecall').hide();
        $('#welcome').show();
        $('#BasicPlan').hide();
        $('#requestmessage').hide();
        $('#checkoutdata').hide();
        $('#backbutton').hide();
        $('#checkoutdata').hide();
        $('#gameplay').show();
        $('#needhelp').hide();
}

function display_next_screen() {
//    console.log(signup_details)
    hideAll();
     $('#progress_' + (current_screen_index + 1)).removeClass('progressclick')
     if (current_screen_index == 'partial_screen') {
        $('#progress_3').removeClass('progressclick')
     }

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
    document.getElementsByClassName('progress')[current_screen_index].disabled = false
    clicked_out_order = false;
    $('#progress_' + (current_screen_index + 1)).addClass('progressclick')
    console.log(current_screen_index)
}

function validate() {
	const name = document.getElementById('name').value;
	const phone = document.getElementById('phone').value;
	const email = document.getElementById('email').value;
	const business = document.getElementById('business').value;
	const title = document.getElementById('title').value;
	flag = 0;

	var text;
	if (name.length < 2) {
	    $('#name').addClass('error-outline')
		flag = 1;
	}

	if (email.indexOf('@') == -1 || email.length < 6) {
	    $('#email').addClass('error-outline')
		flag = 1;
	}
	if (isNaN(phone) || phone.length != 10) {
	    $('#phone').addClass('error-outline')
		flag = 1;
	}

	if (business.length < 2) {
	    $('#business').addClass('error-outline')
        flag = 1;
    }

    if (title.length < 2) {
        $('#title').addClass('error-outline')
        flag = 1;
    }

    if (flag == 1) {
        return false;
    }
	return true;
}

function signUp() {
    $('#name').removeClass('error-outline')
    $('#email').removeClass('error-outline')
    $('#phone').removeClass('error-outline')
    $('#business').removeClass('error-outline')
    $('#title').removeClass('error-outline')

	const valid = validate();
	if (valid) {
	    signup_details['fullname'] = $('#name')[0].value
	    signup_details['email'] = $('#email')[0].value
	    signup_details['number'] = $('#phone')[0].value
	    signup_details['business'] = $('#business')[0].value
	    signup_details['title'] = $('#title')[0].value

        display_next_screen();
	}
}

function updatePlan(plan) {
    selectedPlan = plan
     plan = document.getElementById(selectedPlan)
     details = plan_details[selectedPlan].split("|")

    signup_details['plan_name'] = selectedPlan + " Plan"
    signup_details['plan_amount'] = details[0]


    //next screen values
    $('#planname')[0].innerText = selectedPlan
    $('#planprice')[0].innerText = "$" + details[0] + "/month"

    plandetails = "<div style='display: flex; justify-content: flex-end; width: 100%'>"
    plandetails += "<h4 style='color: black; font-size: 11px; margin-right: 10px; margin-bottom: 5px'>"+ plan_count[selectedPlan]+"</h4>"
    plandetails += "<img src='./images/black_tick.png' width='12px' height='12px'/>"
    plandetails += "</div>"

    plandetails += "<div style='display: flex; justify-content: flex-end; width: 100%'>"
    plandetails += "<h4 style='color: black; font-size: 11px; margin-right: 10px; margin-bottom: 5px'><font size='1'>"+ details[1]+"</font> calls per month</h4>"
    plandetails += "<img src='./images/black_tick.png' width='12px' height='12px' />"
    plandetails += "</div>"

    for (i=2;i<details.length;i++) {
        plandetails += "<div style='display: flex; justify-content: flex-end; width: 100%'>"
        plandetails += "<h4 style='color: black; font-size: 11px; margin-right: 10px; margin-bottom: 5px'>"+ details[i]+"</h4>"
        plandetails += "<img src='./images/black_tick.png' width='12px' height='12px' />"
        plandetails += "</div>"
    }

    notincluded = not_included[selectedPlan].split("|")


    for(i=0; i<notincluded.length;i++) {
        if (notincluded[i] == "") {
            continue;
        }
        plandetails += "<div style='display: flex; justify-content: flex-end; width: 100%'>"
        plandetails += "<h4 style='color: black; font-size: 11px; margin-right: 10px; margin-bottom: 5px'><strike>"+ notincluded[i]+"</strike></h4>"
        plandetails += "<div style='color: black; font-size: 12px; font-weight: bold'>X</div>"
        plandetails += "</div>"
    }
    document.getElementById('plandetails').innerHTML = plandetails

    showAllPlans();
    $('#'+ selectedPlan).hide();
    $('#wdcprice')[0].innerText = Math.floor(details[0] / 2)
    $('#wncprice')[0].innerText = Math.floor(details[0] / 2)
    $('#dncprice')[0].innerText = Math.floor(details[0] / 2)

    for(i in signup_details['add_on_plan']) {
        additional_plan = signup_details['add_on_plan'][i]
        div = document.createElement('h4')
        div.style = 'color: black; font-size: 12px'
        text = "+ " + additional_plan['name']
        div.id = additional_plan['plan'] + "_div"
        text += "  <button id=" +additional_plan['plan']+"_button onclick=cancelPlan(this.id) style='background-color: #f00664; border-radius: 50%; border: none; outline:none; color: white; padding: 3px'>x</button>"
        div.innerHTML = text
        signup_details['add_on_plan'][i]['amount'] = Math.floor(signup_details['plan_amount']/2)
        document.getElementById('plandetails').appendChild(div)
    }
    updatePlanList();

}

function addPlan(plan) {

    $('#' + plan).addClass("button-add-click");
    additional_plan = {'plan': plan}
    switch(plan) {
        case 'wdc':
            additional_plan['name'] = "Weekend Day coverage"
            break;
        case 'wnc':
            additional_plan['name'] = "Weekend Night coverage"
            break;
        case 'dnc':
            additional_plan['name'] = "Daily Night coverage"
    }

    additional_plan['amount'] = Math.floor(signup_details['plan_amount']/2)

    signup_details['add_on_plan'][plan] = additional_plan


//    div = document.createElement('h4')
//    div.style = 'color: black; font-size: 12px'
//    text = "+ " + additional_plan['name']
//    div.id = plan + "_div"
//    text += "  <button id=" +plan+"_button onclick=cancelPlan(this.id) style='background-color: #f00664; border-radius: 50%; border: none; outline:none; color: white; padding: 3px'>x</button>"
//    div.innerHTML = text
//
//    document.getElementById('plandetails').appendChild(div)
}

function cancelPlan(planid) {
    plan = planid.split("_")[0]
    node = document.getElementById(plan + "_div")
    document.getElementById('plandetails').removeChild(node)
    delete signup_details['add_on_plan'][plan]
    $('#' + plan).show();
    updatePlanList();
}

function showAllPlans() {
    $('#Basic').show();
    $('#Pro').show();
    $('#Plus').show();
    $('#NoLimit').show();
}

function addblingnumber(id) {
    if (signup_details['blingphonenumber'] != '') {
        $('#' +signup_details['blingphonenumber'] ).removeClass('button-add-click')
        $('#' +signup_details['blingphonenumber'] ).addClass('button-add')
    }
    signup_details['blingphonenumber'] = id
    $('#' + id).addClass('button-add-click')
    $('#nextbutton')[0].disabled = false;
}

function nextStep() {

        if (current_screen_index == "partial_screen") {
            display_voicemail();
            current_screen_index = 2;
            $('#offhourmessagediv').show();
            $('#welcomemessagediv').hide();
            $('#backbutton').show();
            return;
        }

        switch(parseInt(current_screen_index)) {
            case 0: signUp();
                break;
            case 1: display_next_screen();
                current_screen_index = "partial_screen"
                break;
            case 2: display_next_screen();
                break;
            case 3: display_next_screen();
                break;
            case 4: display_next_screen();
                break;
        }
}


function selectplan(id) {
        $('#'+selectedPlan).removeClass("click");
        $('#'+ selectedPlan).addClass('plan hover')
        selectedPlan = id
        $('#'+ id).addClass('click')
        $('#'+ id).removeClass('plan hover')
        updatePlanList();
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


function golivedate() {
    var nextDate = new Date();
    $('#needhelp').show();

    var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    $('#datesavailable')[0].innerHTML = ""

    for(i=0; i<6; i++) {
        button = document.createElement('button')
        button.onclick = function() {
            updateDate(this.id)
        }
        if ([6, 0].includes(nextDate.getDay())) {
            button.disabled = true
        }

        tempDate = nextDate.toLocaleString('default', options).split(",");
        button.id = nextDate.toLocaleString('default', options)
        button.className = "btn-custom calendar-date"
        text = '<div style="background-color:#69ffa5; height: 15%;"></div>'
        text += '<span style="font-family: droid; font-size: 11px; width: 100%">'+tempDate[1].trim() +'</span>'
        text += '<p style="font-family: droid; font-size: 14px">'+tempDate[0]+'</p>'
        button.innerHTML = text;

         if (i==1) {
            tempDate = nextDate.toLocaleString('default', options);
            signup_details['startdate'] = tempDate
            button.className = "btn-custom calendar-add-click"
        }
        document.getElementById('datesavailable').appendChild(button);
        nextDate.setDate(nextDate.getDate() + 1);
    }

    button = document.createElement('button')
    button.id = "laterdate"
    button.className = "btn-custom calendar-date"
    text = '<div style="background-color:#69ffa5; height: 15%;"></div>'
    text += '<span style="font-family: droid; font-size: 11px; width: 100%" onclick="laterdate()">Later Date</span>'
    button.innerHTML = text;
    document.getElementById('datesavailable').appendChild(button);
}

function updateDate(date) {
    document.getElementById(signup_details['startdate']).classList.remove('calendar-add-click')
    document.getElementById(signup_details['startdate']).classList.add('calendar-date')
    document.getElementById(date).classList.add("calendar-add-click")
    document.getElementById(date).classList.remove("calendar-date")
    signup_details['startdate'] = date
}

function displayBlingNumber() {

    if (signup_details['blingphonenumber'] == '') {
        hideInterval = setInterval(function() {
            if ($('#nextbutton').length > 0) {
                clearInterval(hideInterval);
                $('#nextbutton')[0].disabled = true;
            }
        }, 100)
        listnumbers();
    } else {
        $('#nextbutton').show();
    }
}

function display_welcome() {
    if($('#currentwelcome')[0].innerHTML != '') {
        console.log($('#currentwelcome')[0].innerHTML + " is the value")
        return
    }
    var messages = [
        "Thanks for calling " + signup_details['business'] + ". How may I help you today?",
        "Thanks for calling " + signup_details['business'] + ". How are you doing?",
        signup_details['business']  + " here. what can we do for you today?",
    ]

    $('#currentwelcome')[0].innerHTML = "<span style='color: grey'>Select a message or add a new custom message</span>"
    for(i in messages) {
        button = document.createElement('button')
        button.id = "greeting_message_" + i;
        button.className = "btn-custom button-add"
        if (i == 0) {
            button.className = "btn-custom button-add-click"
            signup_details['welcome_message'] = messages[i]
            signup_details['welcome_message_id'] = button.id
        }
        button.style = "margin: 5px; padding: 5px; text-align: left"
        button.onclick = function() {
            clickNewGreeting(this.innerText, this.id)
        }
        button.innerText = messages[i]
        document.getElementById('currentwelcome').appendChild(button)
    }
}

function display_voicemail() {
    $('#offhourmessagediv').show();
    if($('#currentvoicemail')[0].innerHTML != '') {
        console.log($('#currentvoicemail')[0].innerHTML + " is the value")
        return
    }
    var messages = [
        "Thanks for calling " + signup_details['business'] + ". This is Meghan. Please leave a message and I will callback soon.",
        "Thanks for calling " + signup_details['business'] + ". Our office is closed. Please leave a message and we will callback soon.",
    ]

    $('#currentvoicemail')[0].innerHTML = "<span style='color: grey'>Select a message or add a new custom message</span>"
    for(i in messages) {
        button = document.createElement('button')
        button.id = "voicemail_message_" + i;
        button.className = "btn-custom button-add"
        if (i == 0) {
            button.className = "btn-custom button-add-click"
            signup_details['voicemail_message'] = messages[i]
            signup_details['voicemail_message_id'] = button.id
        }

        button.style = "margin: 5px; padding: 5px; text-align: left"
        button.onclick = function() {
            clickNewVoicemail(this.innerText, this.id)
        }
        button.innerText = messages[i]
        document.getElementById('currentvoicemail').appendChild(button)
    }
}

function clickOutOrder(id) {
    console.log(id)
    console.log(current_screen_index)
    $('#progress_' + (current_screen_index+1)).removeClass('progressclick')
    if (current_screen_index == 'partial_screen') {
        $('#progress_3').removeClass('progressclick')
     }
    button_id = id.split("_")[1]
    clicked_out_order = true
    current_screen_index = parseInt(button_id) -1
    display_next_screen();
}

function listnumbers() {
    if ($('#areacode')[0].value != '' && $('#areacode')[0].value.length < 3) {
        $('#areacode').addClass('error-outline')
        return
    }
    $('#getareacode').hide();
    $('#loader').show();
    document.getElementById('displaynumber').innerHTML = ""
    document.getElementById('displaynumber').style = ""
    $('#areacode').removeClass('error-outline')
    $.ajax({
        type: 'post',
        url: UI_URL + 'list/phonenumber/',
        data: {email: signup_details['email'], areacode: $('#areacode')[0].value},
        success: function (data) {
            type = "showing random numbers"
            for(i=0; i< data.length; i++) {
                if(data[i].substring(1,4) == $('#areacode')[0].value) {
                    type = "showing numbers with selected area code:"
                    break;
                }
            }
            $('#getareacode').show();
            $('#areacode')[0].value = ""
            $('#loader').hide();
            document.getElementById('displaynumber').innerHTML = "<p style='font-size: 12px; color: #f00664'>"+ type+"</p> "
            document.getElementById('displaynumber').style = "margin-bottom: 30px; margin-top: 10px"
            div = document.createElement('div')
            div.style = "margin-top: 10px; display: flex; justify-content: space-around"
            innerhtml = ""

            for(i=0; i< data.length; i++) {
                var match = data[i].match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
                num = '(' + match[2] + ') ' + match[3] + '-' + match[4];
                innerhtml += "<Button class='btn-custom button-add' id="+data[i]+" onclick=addblingnumber(this.id)>" + num + "</Button>"
            }
            div.innerHTML = innerhtml
            document.getElementById('displaynumber').appendChild(div)
        },
        error: function(err) {
            $('#getareacode').show();
            $('#loader').hide();
            console.log(err)
        }
      });
}

function clickNewGreeting(greeting, id) {
    $('#nextbutton')[0].disabled = false
    $('#greetingmessage').removeClass('error-outline')
    if (signup_details['welcome_message'] != '') {
        $('#'+signup_details['welcome_message_id']).removeClass('button-add-click')
        $('#'+signup_details['welcome_message_id']).addClass('button-add')
    }
    signup_details['welcome_message'] = greeting
    signup_details['welcome_message_id'] = id
    $('#'+id).addClass('button-add-click')
}

function updateGreeting() {
    lastchild = document.getElementById('currentwelcome').lastChild
    lastid = parseInt(lastchild.id.split("_")[2])
    newMessage = $('#greetingmessage')[0].value

     $('#greetingmessage').removeClass('error-outline')
    if(newMessage == '') {
        $('#greetingmessage').addClass('error-outline')
        return
    }

    button = document.createElement('button')
    button.id = "greeting_message_" + lastid;
    button.className = "btn-custom button-add"
    button.style = "margin: 5px; padding: 5px; text-align: left"
    button.onclick = function() {
        clickNewGreeting(this.innerText, this.id)
    }
    button.innerText = newMessage
    document.getElementById('currentwelcome').removeChild(lastchild)
    document.getElementById('currentwelcome').appendChild(button)
    clickNewGreeting(newMessage, button.id)
    $('#greetingmessage')[0].value = ""
}

function clickNewVoicemail(voicemail, id) {
    $('#nextbutton')[0].disabled = false
    $('#voicemailmessage').removeClass('error-outline')
    if (signup_details['voicemail_message'] != '') {
        $('#'+signup_details['voicemail_message_id']).removeClass('button-add-click')
        $('#'+signup_details['voicemail_message_id']).addClass('button-add')
    }
    signup_details['voicemail_message'] = voicemail
    signup_details['voicemail_message_id'] = id
    $('#'+id).addClass('button-add-click')
}

function updateVoicemail() {
    lastchild = document.getElementById('currentvoicemail').lastChild
    lastid = parseInt(lastchild.id.split("_")[2])
    newMessage = $('#voicemailmessage')[0].value

     $('#voicemailmessage').removeClass('error-outline')
    if(newMessage == '') {
        $('#voicemailmessage').addClass('error-outline')
        return
    }

    button = document.createElement('button')
    button.id = "voicemail_message_" + lastid;
    button.className = "btn-custom button-add"
    button.style = "margin: 5px; padding: 5px; text-align:left"
    button.onclick = function() {
        clickNewVoicemail(this.innerText, this.id)
    }
    button.innerText = newMessage
    document.getElementById('currentvoicemail').removeChild(lastchild)
    document.getElementById('currentvoicemail').appendChild(button)
    clickNewVoicemail(newMessage, button.id)
    $('#voicemailmessage')[0].value = ""
}

function backStep() {
    $('#nextbutton')[0].disabled = false;
    $('#voicemailmessage').removeClass('button-add-click')
    $('#greetingmessage').removeClass('button-add-click')
    $('#offhourmessagediv').hide();
    $('#welcomemessagediv').show();
    $('#backbutton').hide();
    current_screen_index = "partial_screen"
}

function callnow() {
    $('#callnow').show()
    $('#schedulecall').hide()
}

function schedulecall() {
    $('#callnow').hide()
    $('#schedulecall').show()
}

function requestcallback() {
    var content = "Client Requested a call back. " + signup_details['name'] + " | " + signup_details['email'] + " | " + signup_details['number'] + " | Requested number - " + $('#callbacknumber')[0].value
    $.post("https://www.bling-center.com/slack/note", {message: content, channel: "https://hooks.slack.com/services/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"}, function(data){
                console.log(data)
                $('#callnow').hide();
                $('#requestmessage').show();
            })
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function display_process_payment() {
    $('#checkoutdata').show();
    $('#gameplay').hide();
    hideInterval = setInterval(function() {
        if ($('#nextbutton').length > 0) {
            clearInterval(hideInterval);
            $('#nextbutton').hide();
        }
    }, 100)
}

function updatePlanList() {
//        $('#planlist')[0].innerHTML = ""
//
//        total_amount = 0;
//        // main plan selected
//        text = "<tr>"
//        text += '<td style="padding: 5px; color: black; font-weight: normal; padding-top: 10px; padding-bottom: 10px">'
//        text += '<span>'+selectedPlan+' Plan</span><br>'
//        text += '<span style="font-size: 14px">'+plan_count[selectedPlan]+'</span>'
//        text += '</td>'
//        text += '<td style="padding: 5px; color: black; font-weight: normal">$'+signup_details['plan_amount']+'</td>'
//        text += '</tr>'
//        total_amount += parseInt(signup_details['plan_amount'])
//        // additional plans
//
//        for(i in signup_details['add_on_plan']) {
//            plan = signup_details['add_on_plan'][i]
//            text += "<tr>"
//            text += '<td style="padding: 5px; color: black; font-weight: normal; padding-top: 10px; padding-bottom: 10px">'
//            text += '<span>'+plan['name']+'</span>'
//            text += '<td style="padding: 5px; color: black; font-weight: normal">$'+plan['amount']+'</td>'
//            text += '</tr>'
//            total_amount += parseInt(plan['amount'])
//        }
//
//        plan = signup_details['add_on_plan'][i]
//        text += '<tr style="background-color: #69ffa5">'
//        text += '<td style="padding: 5px; color: black; font-weight: normal; padding-top: 10px; padding-bottom: 10px">'
//        text += '<span>Total</span>'
//        text += '<td style="padding: 5px; color: black; font-weight: normal">$'+total_amount+'</td>'
//        text += '</tr>'
//
//        signup_details['total_amount'] = total_amount
//
//        $('#planlist')[0].innerHTML = text
}

function nextPayment() {
    $('#pullpayment')[0].click()
}

function editgolive() {
    current_screen_index = 4
    clicked_out_order = true
    display_next_screen()
}

function subscribe() {
    console.log("Subscription")
    $('#accountcreate').hide();
    $('#accountsuccess').show();
}

// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys

let stripe = Stripe('pk_test_51J8KaqKxfflH0kh13Qd1Klve2fwpgENVBEoX84jHj2EcUB5uybB0ogd1u3J6AyUUOTNf8s7MYdTxaRj2CaGbZy7Q00RChAtWFu');



var elements = stripe.elements({
fonts: [
  {
    cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
  },
],
locale: window.__exampleLocale
});

var card = elements.create('card', {
iconStyle: 'solid',
style: {
  base: {
    iconColor: '#c4f0ff',
    color: '#fff',
    fontWeight: 500,
    fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
    fontSize: '16px',
    fontSmoothing: 'antialiased',

    ':-webkit-autofill': {
      color: '#fce883',
    },
    '::placeholder': {
      color: '#69ffa5',
    },
  },
  invalid: {
    iconColor: '#FFC7EE',
    color: '#FFC7EE',
  },
},
});

cardInterval = setInterval(function() {
            if ($('#example1-card').length > 0) {
                clearInterval(cardInterval);
                card.mount('#example1-card');
            }
        }, 100)


registerElements([card], 'example1');


card.on('change', function (event) {
  displayError(event);
});

function displayError(event) {
  changeLoadingStatePrices(false);
  let displayError = document.getElementById('card-element-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
}

const btn = document.querySelector('#submit-payment-btn');
//btn.addEventListener('click', async (e) => {
//  e.preventDefault();
//  const nameInput = document.getElementById('name');
//  console.log("Hello Mallika")
//
//  // Create payment method and confirm payment intent.
//  stripe.confirmCardPayment(clientSecret, {
//    payment_method: {
//      card: cardElement,
//      billing_details: {
//        name: nameInput.value,
//      },
//    }
//  }).then((result) => {
//    if(result.error) {
//      alert(result.error.message);
//    } else {
//      // Successful subscription payment
//    }
//  });
//});

function checkout() {
     $.ajax({
        type: 'post',
        url: 'http://localhost:8080/business/checkoutsession',
        data: {lineitem: "Pro", amount: "20", bid: 1030},
        success: function (data) {
            console.log(data)
        },
        error: function(err) {
            console.log("error is " + err)
        }
      });
}

function chatnow() {
    tidioChatApi.open();
    tidioChatApi.messageFromOperator("Hi, I am here. How can I help you?");
}

function callback() {
    tidioChatApi.open();
    tidioChatApi.messageFromOperator("Hi, We would love to talk to you. Please drop your callback number. An account manager will call you soon.");
}

function schedulecall() {
    tidioChatApi.open();
    tidioChatApi.messageFromOperator("Hi, We would love to talk to you. Please click the link below to setup some time as per your availability.");
    tidioChatApi.messageFromOperator("https://calendly.com/alexcarter-100/15min");
}

function laterdate() {
    tidioChatApi.open();
    tidioChatApi.messageFromOperator("Hi, What date would you like to start? We can definitely get you started as per your convenience.")
}

function needhelp() {
    tidioChatApi.open();
    tidioChatApi.messageFromOperator("Hey, my name is Alex. How can I help you.")
    tidioChatApi.messageFromOperator("I can also give you a call to chat further. If you would like that, may I have your phone number?")
}