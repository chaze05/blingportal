//UI_URL= "http://localhost:8080/business/"
var id;
var msg_count = 0;
UI_URL = 'https://www.bling-center.com/business/';

$('.accordion-toggle').click(function () {
	$('.hiddenRow').hide();
	$(this).next('tr').find('.hiddenRow').show();
});

function backbusiness() {
    window.location.href = 'businesslist_v3.html'
}

$(document).ready(function () {
    $('#loadermid').show();
    $('#loaderright').hide();
    $('#loadercall').show();
    $('#incall').hide();
    $('#loaderparam').hide();
    $('#phoneerror').hide();
    $('#clist').hide();
    $('#overageerror').hide();
    $('#serviceerror').hide();
    id = window.location.href.split('id=').pop()

    $('#profile-detail').hide();
    $.ajax({
        type: 'get',
        url: UI_URL + 'profile/' + id,
        success: function (data) {
            console.log(data);
            $('#loader').hide();
            $('#profile-detail').show();
            displayprofile(data.data);
        },
        error: function(err) {
            $('#loader').hide()
        }
    });

    $.ajax({
        type: 'get',
        url: UI_URL + 'message/' + id,
        success: function (data) {
            console.log(data);
            $('#loadermid').hide();
            displaymessage(data.data);
            $('#cardmessage').show();
        },
        error: function(err) {
            $('#loadermid').hide()
            displaymessage([]);
        }
    });

    $.ajax({
        type: 'get',
        url: UI_URL + 'callrecords/' + id,
        success: function (data) {
            console.log(data);
            inbounddata(data);
        },
        error: function(err) {
            inbounddata([]);
        }
    });

    $.ajax({
        type: 'get',
        url: UI_URL + 'call/count/portal/' + id,
        success: function (data) {
            console.log(data.data);
            detail = data.data
            document.getElementById('callcount').innerHTML = detail.calls_accepted + "/" + detail.call_plan
        },
        error: function(err) {
            document.getElementById('callcount').innerHTML = "Unavailable"
        }
    });

   var span = document.getElementsByClassName("close")[0];
   var modal = document.getElementById("mymodel");
    // When the user clicks on <span> (x), close the modal
   span.onclick = function() {
     modal.style.display = "none";
     $('#vdiv').hide()
     $('#gdiv').hide()
   }

   // When the user clicks anywhere outside of the modal, close it
   window.onclick = function(event) {
     if (event.target == modal) {
       modal.style.display = "none";
       $('#vdiv').hide()
       $('#gdiv').hide()
     }
   }
});

function updateGreeting() {
	document.getElementById('updating').innerHTML = 'Updating';
	document.getElementById('updating').innerHTML = '';
	$.ajax({
		type: 'post',
		url: UI_URL + 'greeting',
		data: {
			greeting: $('#greetmsg')[0].value,
			id: id,
		},
		headers: { 'Accept': 'application/json' },
		success: function (data) {
			document.getElementById('updating').innerHTML = '';
			document.getElementById('mymodel').style.display = 'none';
			$('#vdiv').hide();
			$('#gdiv').hide();
			document.getElementById('greeting').innerHTML = $('#greetmsg')[0].value;
		},
		error: function (err) {
			document.getElementById('updating').innerHTML =
				'Error Updating. Please try later';
		},
	});
}

function updateVoicemail() {
	document.getElementById('updating').innerHTML = 'Updating';
	document.getElementById('updating').innerHTML = '';
	$.ajax({
		type: 'post',
		url: UI_URL + 'voicemail',
		data: { voicemail: $('#voicemsg')[0].value, id:id },
		headers: { 'Accept': 'application/json' },
		success: function (data) {
			document.getElementById('updating').innerHTML = '';
			document.getElementById('mymodel').style.display = 'none';
			$('#vdiv').hide();
			$('#gdiv').hide();
			document.getElementById('voicemail').innerHTML = $('#voicemsg')[0].value;
		},
		error: function (err) {
			document.getElementById('updating').innerHTML =
				'Error Updating. Please try later';
		},
	});
}

function addMessage() {
	if ($('#newmessage')[0].value != '') {
	    const options = { year: 'numeric', month: 'short', day: 'numeric' };
	    dt = new Date();
		$.ajax({
			type: 'post',
			url: UI_URL + 'message',
			data: {
				content: $('#newmessage')[0].value,
				id: id,
				from: 'wing',
			},
			headers: { 'Accept': 'application/json' },
			success: function (data) {
				if (msg_count == 0) {
				    document.getElementById('mlist').innerHTML = ''
				    msg_count = 1;
				}
				addWingMessage($('#newmessage')[0].value, dt.toLocaleTimeString('en-US', options))
				$('#newmessage')[0].value = '';
			},
			error: function (err) {
				$('#newmessage')[0].value = 'Error Sending Message. Please try later';
			},
		});
	}
}

function displayprofile(data) {
	detail = data.business;

	document.getElementById('businessname').innerHTML = detail.businessname;
	mdetail = detail.managerName;

	document.getElementById('price').innerHTML = '$' + detail.price;
	document.getElementById('outbound').innerHTML = detail.outboundcall;
	document.getElementById('inbound').innerHTML = detail.inboundcall;
	$('#togBtnoverage')[0].checked = detail.overagecalls
	$('#togBtnservice')[0].checked = false
	if (detail.status.toLowerCase() == 'ongoing') {
	    $('#togBtnservice')[0].checked = true
	}
	if (detail.email == true) {
	    document.getElementById('email').innerHTML = '<img src="./images/tick.png" />';
    }

    if (detail.message == true) {
	    document.getElementById('message').innerHTML = '<img src="./images/tick.png" />';
	}

	if (detail.survey == true) {
	    document.getElementById('survey').innerHTML = '<img src="./images/tick.png" />';
	}

	// document.getElementById("blingnum").innerHTML = phtml
	document.getElementById('greeting').innerHTML = detail.welcomemessage;
	document.getElementById('voicemail').innerHTML = detail.closedbizmessage;
	document.getElementById('managername').innerHTML = mdetail;
	if (detail.callcountin > 0) {
	    document.getElementById('callType').innerHTML = 'Inbound calls'
	} else {
	    document.getElementById('callType').innerHTML = 'Outbound calls'
	}
}

function cleanup() {
	document.getElementById('businessname').innerHTML = '';
	document.getElementById('manager').innerHTML = '';
}

function displaymessage(data) {
	mhtml = '';
	if (data.length == 0) {
	    html = '<center><div style="background-color: black; margin: 10px; padding:10px; border-radius: 10px; font-size: 16px">'
	    html += 'Please Drop a message to reach out to us.</div></center>';
	    document.getElementById('mlist').innerHTML = html;
	    msg_count = 0;
        return;
	}
	const options = { year: 'numeric', month: 'short', day: 'numeric' };
	msg_count = 1;
	for (i in data) {
		msg = data[i];

		dt = new Date(msg.createdDate);

		if (msg.messageFrom == 'wing') {
		    addWingMessage(msg.messagecontent, dt.toLocaleTimeString('en-US', options))
		} else {
		    addBlingMessage(msg.messagecontent, dt.toLocaleTimeString('en-US', options))
		}
	}
}

function cancel() {
	$('#editscript').show();
	$('#updateScript').hide();
	element = document.getElementById('script');
	element.style.backgroundColor = '#DCDCDC';
	element.readOnly = true;
}

function inbounddata(data) {
    $('#loadercall').hide()
    $('#incall').show()
	inhtml = '';
	count = 1;
	document.getElementById('incall').innerHTML = ''
	if (data.length == 0) {
	    html = '<center><div style="background-color: black; margin: 10px; padding:10px; border-radius: 10px; font-size: 16px">'
        	    html += 'No Data Found</div></center>';
	    document.getElementById('incall').innerHTML = html;
	    return;
	}
	width = '5%'
	for (i in data) {
	    div = document.createElement('div')
	    div.style = "margin-bottom: 20px; background-color: #00001D; width: 93%; padding: 6px; border-radius: 5px"
		call = data[i];
		dt = new Date(call.createdDate);
		note = ''
		badge =''
		url = ''
		if (call.callstatus == 'Needs CallBack') {
            sign = '<img src="./images/incoming.png" width="'+width+'" height="'+width+'"/>'
            url = call.recordUrl
            note = call.callNote
            badge = '<span class="badge-success">Needs CallBack</span>'
        }else if (call.callstatus == 'CallBack') {
             sign = '<img src="./images/outbound.png" width="'+width+'" height="5%" />'
             url = call.recordUrl
         } else if (call.callstatus == 'Spam Call/ Sale') {
           sign = '<img src="./images/incoming.png" width="'+width+'" height="5%"/>'
           url = call.recordUrl
           note = call.callNote
           badge = '<span class="badge-secondary">Spam/ Sales Call</span>'
       } else if (call.callstatus == 'Voicemail') {
             sign = '<img src="./images/incoming.png" width="'+width+'" height="5%"/>'
             url = call.recordUrl
             badge = '<span class="badge-danger">Voicemail</span>'
         } else if (call.callstatus == 'Incoming Message') {
           sign = '<img src="./images/msg_in.png" width="10%" height="5%"/>'
           note = call.callNote
       }else if (call.callstatus == 'Outgoing Message') {
            sign = '<img src="./images/msg_in.png" width="10%" height="5%"/>'
            note = call.callNote
        } else if (call.callstatus == 'Outbound Call') {
              sign = '<img src="./images/outbound.png" width="5%" height="5%" />'
              url = call.recordUrl
          } else {
            sign = '<img src="./images/incoming.png" width="'+width+'" height="'+width+'"/>'
            url = call.recordUrl
            if (call.callNote != null) {
            note = call.callNote
            }
         }

         flag = 0;

        inhtml = '<div style="display: flex;">'
		inhtml += sign

		inhtml += '<p style="padding-left: 20px">' + call.customerPhoneNumber + '</p>'
		if (url != '') {
		    inhtml += "<audio controls style='width: 250px;padding-left: 20px; outline: none'><source src='" + url + "'></audio>"
		} else if (note != '' && note != null) {
		    inhtml += '<p style="padding-left: 20px; font-size: 14px">' + note + "</p>"
		    flag = 1
		}
		inhtml += '</div>'

        if (flag == 0 && note != '' && note != null) {
            inhtml += '<span style="margin: 20px; font-size: 14px">' + note + "</span>"
        }
        inhtml += '<span style="padding: 5px; color: white">' + dt.toLocaleDateString(undefined, {
                                                                                  				year: 'numeric',
                                                                                  				month: 'short',
                                                                                  				day: 'numeric',
                                                                                  			}) + "</span>"

        inhtml += badge

		div.innerHTML = inhtml;
		document.getElementById('incall').appendChild(div);
	}
}




function addBlingMessage(message, date) {
    div = document.createElement('div')
    div.style = "margin: 5px"

    html = '<div class="senderBling">'+message+'</div>'
    html += '<div style="float: left; width: 100%; height: 2px"></div>'
    html += '<div style="float: left">'
    html += '<small style="color: white; margin: 5px;">'+date+'</small>'
    html += '</div>'
    html += '<div style="float: left; width: 100%; height: 20px"></div>'

    div.innerHTML = html;
    document.getElementById('mlist').appendChild(div)
}

function addWingMessage(message, date) {
    div = document.createElement('div')
    div.style = "margin: 5px"

    html = '<div class="senderWing">'+message+'</div>'
    html += '<div style="float: right; width: 100%; height: 2px"></div>'
    html += '<div style="float: right">'
    html += '<small style="color: white; margin: 5px;">'+date+'</small>'
    html += '</div>'
    html += '<div style="float: right; width: 100%; height: 20px"></div>'

    div.innerHTML = html;
    document.getElementById('mlist').appendChild(div)
}

function getrecords() {
    var number = $('#searchnum')[0].value
    $('#loadercall').show()
    $('#incall').hide()
    $.ajax({
        type: 'get',
        url: UI_URL + 'search/' + number + '_' + id,
        success: function (data) {
            console.log(data);
            $('#clist').show();
            if (data.length == 0) {
                $('#phoneerror').show()
            }
            inbounddata(data);
        },
        error: function(err) {
            $('#loadercall').hide()
            $('#phoneerror').show()
            inbounddata([]);
        }
    });
}

function allRecords() {
    $('#loadercall').show()
    $('#clist').hide();
    $('#incall').hide()
    $('#phoneerror').hide()
    $.ajax({
        type: 'get',
        url: UI_URL + 'callrecords/' + id,
        success: function (data) {
            console.log(data);
            inbounddata(data);
        },
        error: function(err) {
            $('#loadercall').hide()
            inbounddata([]);
        }
    });
}

function updateservice() {
    $('#serviceerror').hide();
    var status = $('#togBtnservice')[0].checked
    $.ajax({
        type: 'post',
        url: UI_URL + 'disableService/portal',
        data: {
            businessId: id,
            turnon: status,
        },
        success: function (data) {
            console.log(status)
        },
        error: function (err) {
            $('#serviceerror').show();
            if (status == false) {
                $('#togBtnservice')[0].checked = true
            } else {
                $('#togBtnservice')[0].checked = false
            }
        },
    });
}

function updateoverage() {
    $('#overageerror').hide();
    var status = $('#togBtnoverage')[0].checked
    $.ajax({
    		type: 'post',
    		url: UI_URL + 'overageCalls/portal',
    		data: {
    			businessId: id,
    			turnon: status,
    		},
    		success: function (data) {
    		    console.log(status)
    		},
    		error: function (err) {
    		    $('#overageerror').show();
    			if (status == false) {
    			    $('#togBtnoverage')[0].checked = true
    			} else {
    			    $('#togBtnoverage')[0].checked = false
    			}
    		},
    	});
}

function updategreeting() {
    var modal = document.getElementById("mymodel");
    $('#vdiv').hide()
    modal.style.display = "block";
            $('#gdiv').show()
            document.getElementById('modalheader').innerHTML = "Greeting"
            document.getElementById('greetmsg').value = document.getElementById("greeting").innerHTML
}

function updatevoicemail() {
    var modal = document.getElementById("mymodel");
    $('#gdiv').hide()
    modal.style.display = "block";
              $('#vdiv').show()
              document.getElementById('modalheader').innerHTML = "Voicemail"
              document.getElementById('voicemsg').value = document.getElementById("voicemail").innerHTML
}