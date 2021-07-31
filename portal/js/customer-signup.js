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
    'add_on_plan': [],
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
    'Basic': '5 inbound calls/day',
    'Plus': '15 inbound calls/day',
    'Pro': '30 inbound calls/day',
    'NoLimit': '90 inbound calls/day',
}

var add_on_package = {
    "wdc": {"name": "Reception, Weekend", "amount": 0},
    "w8c": {"name": "Reception, +8hrs Weekdays", "amount": 0},
    "d5c": {"name": "Reception, 5 call extra/ day", "amount": 0},
    "utm": {"name": "Unlimited, Texts/Messages", "amount": 199},
    "scc": {"name": "Sales Call, 100 calls/day", "amount": 599},
    "cpc": {"name": "Custom Plan", "amount": "After Signup"}
}

var current_screen_index = -1;
var next_screen_index = 0;
var in_progress_screen_index = -1;
var screens = ['selectplan', 'selectnumber', 'welcomemessagediv', 'golivediv', 'processpayment']
var function_calls = [do_nothing,displayBlingNumber, display_welcome, golivedate, display_process_payment]
var clicked_out_order = false
var welcome_next_id = 4
var voicemail_next_id = 3
var chatuserid;
var cookie_data = {}
// A reference to Stripe.js initialized with a fake API key.
// Sign in to see examples pre-filled with your key.
//var stripe = Stripe("pk_test_TYooMQauvdEDq54NiTphI7jx");


$(document).ready(function () {

    var cookie_available = false
    var cookies = document.cookie.split(";")
    var expire = ''
    var reset = false
    for(i in cookies) {
        cookie = cookies[i]
        if (cookie.indexOf("expires=") > 0) {
            expire = cookie.split("=")[1]
        }

        if (cookie.indexOf("currentindex=") > 0) {
            current_screen_index = cookie.split("=")[1]
            cookie_available = true
        }

        if (cookie.indexOf("blingautosignupdetails=") > 0) {
            cookie_data = JSON.parse(cookie.split("=")[1])
        }

        if (cookie.indexOf("reset=") > 0) {
            reset = cookie.split("=")[1] == 'true' ? true : false
        }
    }

    if (!reset && new Date() > new Date(expire)) {
        document.cookie = "reset=true; currentindex=-1;cookie_data={}"
        window.location.replace("https://www.bling.cloud")
        return
    }

    var todaysDate = new Date();
    var year = todaysDate.getFullYear();
    var month = ("0" + (todaysDate.getMonth() + 1)).slice(-2);
    var day = ("0" + todaysDate.getDate()).slice(-2);
    var minDate = (year +"-"+ month +"-"+ day);

    var link = window.location.href.split("?")
    updatePlan(link[1]);

    hideAll();
    $('#accountsuccess').hide();

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

    chatinterval = setInterval(function() {
        if (window.fcWidget) {
            clearInterval(chatinterval)
            window.fcWidget.user.get().then(function(result) {
                chatuserid = result.data.alias
            });
        }
    }, 100)

    if (cookie_available) {
        jumpToNextScreen()
    } else {
        display_next_screen();
    }
});

function jumpToNextScreen() {
    elements = document.getElementsByClassName('progress')
    for(i=0; i< current_screen_index; i++) {
        elements[i].disabled = false
    }

    current_screen_index -= 1;
    in_progress_screen_index = current_screen_index
    next_screen_index = current_screen_index + 1

    if (current_screen_index > 2) {
        current_screen_index = 1
    }

    if ('profile' in cookie_data) {
        displayProfiledata()
    }

    if ('listblingnumbers' in cookie_data) {
        displayRandomNumbers(cookie_data['listblingnumbers'])
        if (cookie_data['blingnumber'] != '') {
            addblingnumber(cookie_data['blingnumber'])
        }
    }

    if ('welcome_message' in cookie_data) {
        add_welcome_messages(cookie_data['welcome_message'])
    }

    if ('welcome_message' in cookie_data) {
        add_voicemail_message(cookie_data['voicemail_message'])
    }

    display_next_screen()

}

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
    document.cookie = "currentindex=" + current_screen_index
    document.cookie = "expires="+ new Date(new Date().getTime() + 60*24*7*60000);
    document.cookie = "blingautosignupdetails="+ JSON.stringify(cookie_data)
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
	    update_signup_profile()
	    cookie_data['profile'] = {
	        'fullname': $('#name')[0].value,
	        'email': $('#email')[0].value,
	        'number': $('#phone')[0].value,
	        'business': $('#business')[0].value,
	        'title': $('#title')[0].value
	    }
        display_next_screen();
	}
}

function update_signup_profile() {
    signup_details['fullname'] = $('#name')[0].value
    signup_details['email'] = $('#email')[0].value
    signup_details['number'] = $('#phone')[0].value
    signup_details['business'] = $('#business')[0].value
    signup_details['title'] = $('#title')[0].value
}

function displayProfiledata() {
    $('#name')[0].value = cookie_data['profile']['fullname']
    $('#email')[0].value = cookie_data['profile']['email']
    $('#phone')[0].value = cookie_data['profile']['number']
    $('#business')[0].value = cookie_data['profile']['business']
    $('#title')[0].value = cookie_data['profile']['title']

    update_signup_profile()
}

function updatePlan(plan) {
     selectedPlan = plan
     if (!(plan in plan_details)) {
        if ('plan' in cookie_data) {
            selectedPlan = cookie_data['plan']
        } else {
            selectedPlan = "Plus"
        }
     }

     cookie_data['plan'] = selectedPlan
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
    add_on_package["wdc"]["amount"] = Math.floor(details[0] / 2)
    add_on_package["w8c"]["amount"] = Math.floor(details[0] / 2)
    add_on_package["d5c"]["amount"] = Math.floor(details[0] / 2)

    $('#wdcprice')[0].innerText = add_on_package["wdc"]["amount"]
    $('#w8cprice')[0].innerText = add_on_package["w8c"]["amount"]
    $('#d5cprice')[0].innerText = add_on_package["d5c"]["amount"]

}

function addPlan(plan) {
    if (signup_details['add_on_plan'].includes(plan)) {
        id = signup_details['add_on_plan'].indexOf(plan)
        signup_details['add_on_plan'].splice(id,  1)

        $('#' + plan).removeClass("click-plan");
        $('#' + plan)[0].removeChild($('#' + plan)[0].children[0])
        $('#' + plan).addClass("options");
        console.log(signup_details['add_on_plan'])
        return
    }

    $('#' + plan).removeClass("options");
    $('#' + plan).addClass("click-plan");
    signup_details['add_on_plan'].push(plan)

    image = document.createElement('img')
    image.src = "./images/black_tick.png"
    image.style = "width: 15px; height: 15px"
    $('#' + plan)[0].insertBefore(image, $('#' + plan)[0].children[0])
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
    cookie_data['blingnumber'] = id
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
            case 3:
                if (signup_details['startdate'] == "laterdate" && $('#delaydate')[0].value == "") {
                    $('#delaydate').addClass('error-outline')
                    return
                }
                display_next_screen();
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
    $('#adddelaydate').hide();
    flag = false

    var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    $('#datesavailable')[0].innerHTML = ""
    $('#delaydate').removeClass('error-outline')

    if (signup_details['startdate'] == 'laterdate') {
        flag = true
    }

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
        text += '<span style="font-family: droid; font-size: 11px; width: 100%">'+tempDate[1].trim() +'</span><br>'
        text += '<span style="font-family: droid; font-size: 14px">'+tempDate[0]+'</span>'
        button.innerHTML = text;

         if (!flag && i>0 && ![6, 0].includes(nextDate.getDay())) {
            tempDate = nextDate.toLocaleString('default', options);
            signup_details['startdate'] = tempDate
            button.className = "btn-custom calendar-add-click"
            flag = true
        }
        document.getElementById('datesavailable').appendChild(button);
        nextDate.setDate(nextDate.getDate() + 1);
    }

    button = document.createElement('button')
    button.id = "laterdate"
    button.className = "btn-custom calendar-date"
    if (signup_details['startdate'] == 'laterdate') {
        button.className = "btn-custom calendar-add-click"
        $('#adddelaydate').show();
     }
    button.onclick = function() {
         updateDate(this.id)
     }
    button.style = "padding: 2px"
    text = '<div style="background-color:#69ffa5; height: 15%;"></div>'
    text += '<span style="font-family: droid; font-size: 11px; width: 100%">or</span><br>'
    text += '<span style="font-family: droid; font-size: 10px">Later Date</span>'
    button.innerHTML = text;
    document.getElementById('datesavailable').appendChild(button);

    $('#wdcprice')[0].innerText = add_on_package["wdc"]["amount"]
    $('#w8cprice')[0].innerText = add_on_package["w8c"]["amount"]
    $('#d5cprice')[0].innerText = add_on_package["d5c"]["amount"]
    $('#utmprice')[0].innerText = add_on_package["utm"]["amount"]
    $('#sccprice')[0].innerText = add_on_package["scc"]["amount"]
    $('#cpcprice')[0].innerText = add_on_package["cpc"]["amount"]

}

function updateDate(date) {
    document.getElementById(signup_details['startdate']).classList.remove('calendar-add-click')
    document.getElementById(signup_details['startdate']).classList.add('calendar-date')
    $('#adddelaydate').hide()

    if (date == 'laterdate') {
        $('#adddelaydate').show()
    }

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

    cookie_data['welcome_message'] = messages
    add_welcome_messages(messages)
}

function add_welcome_messages(messages) {
    $('#currentwelcome')[0].innerHTML = "<span style='color: grey; font-size: 12px; padding-left:7px'>Select a message or add a new custom message<br></span>"
    for(i in messages) {
        button = document.createElement('button')
        button.id = "greeting_message_" + i;
        button.className = "btn-custom button-add"
        if (i == 0) {
            button.className = "btn-custom button-add-click"
            signup_details['welcome_message'] = messages[i]
            signup_details['welcome_message_id'] = button.id
        }
        button.style = "margin: 5px; padding: 6px; text-align: left; margin-top: 6px"
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

    cookie_data['voicemail_message'] = messages
    add_voicemail_message(messages)
}

function add_voicemail_message(messages) {
    $('#currentvoicemail')[0].innerHTML = "<span style='color: grey; font-size:12px; padding-left:7px'>Select a message or add a new custom message<br></span>"
    for(i in messages) {
        button = document.createElement('button')
        button.id = "voicemail_message_" + i;
        button.className = "btn-custom button-add"
        if (i == 0) {
            button.className = "btn-custom button-add-click"
            signup_details['voicemail_message'] = messages[i]
            signup_details['voicemail_message_id'] = button.id
        }

        button.style = "margin: 5px; padding: 6px; text-align: left; margin-top: 6px"
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
            cookie_data['listblingnumbers'] = data
            displayRandomNumbers(data)
        },
        error: function(err) {
            $('#getareacode').show();
            $('#loader').hide();
            console.log(err)
        }
      });
}

function displayRandomNumbers(data) {
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
    newMessage = $('#greetingmessage')[0].value

     $('#greetingmessage').removeClass('error-outline')
    if(newMessage == '') {
        $('#greetingmessage').addClass('error-outline')
        return
    }

    div = document.createElement('div')
    button = document.createElement('button')
    div.appendChild(button)
    button.id = "greeting_message_" + welcome_next_id;
    welcome_next_id += 1;
    button.className = "btn-custom button-add"
    button.style = "margin: 5px; padding: 6px; text-align: left; margin-top: 6px"
    button.onclick = function() {
        clickNewGreeting(this.innerText, this.id)
    }
    button.innerText = newMessage
    document.getElementById('currentwelcome').removeChild(lastchild)
    eElement = document.getElementById('currentwelcome')
    eElement.insertBefore(div, eElement.children[1]);
    cookie_data['welcome_message'].pop()
    cookie_data['welcome_message'].unshift(newMessage)
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
    newMessage = $('#voicemailmessage')[0].value

     $('#voicemailmessage').removeClass('error-outline')
    if(newMessage == '') {
        $('#voicemailmessage').addClass('error-outline')
        return
    }

    button = document.createElement('button')
    button.id = "voicemail_message_" + voicemail_next_id;
    voicemail_next_id += 1;
    button.className = "btn-custom button-add"
    button.style = "margin: 5px; padding: 6px; text-align:left; margin-top: 6px"
    button.onclick = function() {
        clickNewVoicemail(this.innerText, this.id)
    }
    button.innerText = newMessage
    document.getElementById('currentvoicemail').removeChild(lastchild)
    eElement = document.getElementById('currentvoicemail')
    cookie_data['voicemail_message'].pop()
    cookie_data['voicemail_message'].unshift(newMessage)
    eElement.insertBefore(button, eElement.children[1]);
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
    $('#nextbutton').hide()

    $('#planname1')[0].innerText = selectedPlan
    $('#plancalls')[0].innerText = plan_count[selectedPlan]
    $('#monthlyfee')[0].innerText = "$" +signup_details['plan_amount']
    document.getElementById('addonplans').innerText = ""
    total = parseInt(signup_details['plan_amount'])

    console.log(signup_details['add_on_plan'])
    for (i in signup_details['add_on_plan']) {
        planname = signup_details['add_on_plan'][i]
        details = add_on_package[planname]
        tr = document.createElement("tr")
        tr.style = "width: 100%"
        text = '<td style="width: 70%; font-size: 11px">+' + details['name']
        text += '</td>'
        text += '<td style="text-align: right">$' + details['amount']
        text += '</td>'
        tr.innerHTML = text
        document.getElementById('addonplans').appendChild(tr)
        if (planname == 'cpc') {
            continue
        }
        total += parseInt(details['amount'])
    }

    $('#total')[0].innerText = "$" + total
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
    iconColor: '#f00664',
    color: 'black',
    fontWeight: 300,
    fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
    fontSize: '15px',
    fontSmoothing: 'antialiased',

    ':-webkit-autofill': {
      color: 'black',
    },
    '::placeholder': {
      color: 'black',
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

function needhelp() {
//      $.ajax({
//          type: 'post',
//          url: 'http://localhost:8080/business/checkoutsession',
//          headers: {
//            'Accept': 'application/json',
//            'Authorization': 'Bearer <access-token>',
//            'Content-Type': 'application/json'
//          },
//          data: {lineitem: "Pro", amount: "20", bid: 1030},
//          success: function (data) {
//              console.log(data)
//          },
//          error: function(err) {
//              console.log("error is " + err)
//          }
//        });
//    window.fcWidget.open({ name: "Alex", replyText: "Hey, my name is Alex. How can I help you."  });
//    window.fcWidget.open({ name: "Alex", replyText: "I can also give you a call to chat further. If you would like that, may I have your phone number?"  });
    window.fcWidget.open()
}

