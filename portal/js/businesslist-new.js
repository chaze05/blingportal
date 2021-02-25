//UI_URL= "http://localhost:8080/business/"
UI_URL = "https://www.bling-center.com/business/"

$('.accordion-toggle').click(function(){
	$('.hiddenRow').hide();
	$(this).next('tr').find('.hiddenRow').show();
});

function buttonclick(id) {
    $('#businesslist').hide();
    $('#profiledetails').show();
    $('#loaderleft').show();
    $('#loadermid').show();
    $('#loaderright').show();
    $('#backoutlist').hide();
    $('#searcholist').hide();
    $('#loaderout').hide();
    $('#outerror').hide()

    $.ajax({
        type: 'get',
        url: UI_URL + 'profile/' + id,
        success: function (data) {
         console.log(data)
         $('#loaderleft').hide()
         displayprofile(data.data)
         $('#detailscard').show();
        }
      });

    $.ajax({
        type: 'get',
        url: UI_URL + 'message/' + id,
        success: function (data) {
         console.log(data)
         $('#loadermid').hide()
         displaymessage(data.data)
         $('#cardmessage').show();
        }
      });

    $.ajax({
        type: 'get',
        url: UI_URL + 'script/' + id,
        success: function (data) {
         console.log(data)
         $('#loaderright').hide()
//         displaydetails(data)
        }
      });

    $.ajax({
            type: 'get',
            url: UI_URL + 'inbound/' + id,
            success: function (data) {
             console.log(data)
//             inbounddata(data)
            }
          });

    $.ajax({
            type: 'get',
            url: UI_URL + 'outbound/' + id,
            success: function (data) {
            console.log("Outbound calls")
             outbounddata(data)
            }
          });
}

function backbusiness() {
    $('#businesslist').show();
    $('#profiledetails').hide();
    $('#loader').show()
    $('#detailscard').hide();
    $('#cardmanager').hide();
    $('#cardmessage').hide();
    $('#updateScript').hide();
    cleanup()
}

$(document).ready(function() {
    $('#profiledetails').hide();
    $('#detailscard').hide();
    $('#loaderleft').hide();

    $('#loadermid').hide();
    $('#cardmessage').hide();

    $('#loaderright').hide();
    $('#cardmanager').hide();
    $('#updateScript').hide()
    $('#blistcard').hide()

$('[data-toggle="tooltip"]').tooltip();
//$('#bcard').hide();

    $.ajax({
        type: 'get',
        url: UI_URL + 'list/wing',
        success: function (data) {
         $('#blistload').hide()
         $('#blistcard').show()
         $('#berror').hide()
         displaylist(data.data)
        },
        error: function(err) {
            $('#blistload').hide()
            $('#blistcard').show()
        }
      });
})



function editmanagerdetails() {
       var modal = document.getElementById("mymodel");
       var btn1 = document.getElementById("editmanager");
       var btn2 = document.getElementById("greetbutton");
       var btn3 = document.getElementById("voicebutton");

       $('#vdiv').hide()
       $('#mdiv').hide()
       $('#gdiv').hide()

       // Get the <span> element that closes the modal
       var span = document.getElementsByClassName("close")[0];

       // When the user clicks the button, open the modal
       btn1.onclick = function() {
         modal.style.display = "block";
         $('#mdiv').show()
         detail = document.getElementById("managerhiddendetail").innerHTML.split(";")
         document.getElementById('modalheader').innerHTML = "Manager Details"
         document.getElementById('formmanagername').value = detail[0]
         document.getElementById('formmanagernum').value = detail[1]
         document.getElementById('formmanageremail').value = detail[2]
       }

       btn2.onclick = function() {
        modal.style.display = "block";
        $('#gdiv').show()
        document.getElementById('modalheader').innerHTML = "Greeting"
        document.getElementById('greetmsg').value = document.getElementById("greeting").innerHTML
      }

       btn3.onclick = function() {
          modal.style.display = "block";
          $('#vdiv').show()
          document.getElementById('modalheader').innerHTML = "Voicemail"
          document.getElementById('voicemsg').value = document.getElementById("voicemail").innerHTML
       }

       // When the user clicks on <span> (x), close the modal
       span.onclick = function() {
         modal.style.display = "none";
         $('#vdiv').hide()
        $('#mdiv').hide()
        $('#gdiv').hide()
       }

       // When the user clicks anywhere outside of the modal, close it
       window.onclick = function(event) {
         if (event.target == modal) {
           modal.style.display = "none";
           $('#vdiv').hide()
                  $('#mdiv').hide()
                  $('#gdiv').hide()
         }
       }
}

function updateManagerDetails() {
    document.getElementById("updating").innerHTML = "Updating";
    $.ajax({
            type: 'post',
            url: UI_URL + 'managerupdate',
            data: {name: $('#formmanagername')[0].value, phone: $('#formmanagernum')[0].value, email: $('#formmanageremail')[0].value, id: $('#businessid')[0].innerHTML},
            success: function (data) {
                document.getElementById("updating").innerHTML = "";
                document.getElementById("mymodel").style.display = "none";
                $('#vdiv').hide()
                  $('#mdiv').hide()
                  $('#gdiv').hide()
                mdetail = $('#formmanagername')[0].value
                if (mdetail == null) {
                    mdetail = ""
                }
                document.getElementById("mname").innerHTML = mdetail
                html_val = '<em>Email</em> : <b>'+ $('#formmanageremail')[0].value+'</b><br>'
                html_val += '<em>Phone Number</em> : <b>'+$('#formmanagernum')[0].value+'</b>'
                $('#manager').attr('data-original-title', html_val)

                document.getElementById('managerhiddendetail').innerHTML =
                $('#formmanagername')[0].value + ";" + $('#formmanagernum')[0].value + ";" + $('#formmanageremail')[0].value
            },
            error: function(err) {
                document.getElementById("updating").innerHTML = "Error Updating. Please try later";
            }
          });
}

function updateGreeting() {
    document.getElementById("updating").innerHTML = "Updating";
    $.ajax({
            type: 'post',
            url: UI_URL + 'greeting',
            data: {greeting: $('#greetmsg')[0].value, id: $('#businessid')[0].innerHTML},
            success: function (data) {
                document.getElementById("updating").innerHTML = "";
                document.getElementById("mymodel").style.display = "none";
                $('#vdiv').hide()
                  $('#mdiv').hide()
                  $('#gdiv').hide()
                document.getElementById("greeting").innerHTML = $('#greetmsg')[0].value

            },
            error: function(err) {
                document.getElementById("updating").innerHTML = "Error Updating. Please try later";
            }
          });
}

function updateVoicemail() {
    document.getElementById("updating").innerHTML = "Updating";
    $.ajax({
            type: 'post',
            url: UI_URL + 'managerupdate',
            data: {name: $('#voicemsg')[0].value, id: $('#businessid')[0].innerHTML},
            success: function (data) {
                document.getElementById("updating").innerHTML = "";
                document.getElementById("mymodel").style.display = "none";
                $('#vdiv').hide()
                                  $('#mdiv').hide()
                                  $('#gdiv').hide()
                document.getElementById("voicemail").innerHTML = $('#voicemsg')[0].value
            },
            error: function(err) {
                document.getElementById("updating").innerHTML = "Error Updating. Please try later";
            }
          });
}

function addMessage() {
    if ($('#newmessage')[0].value != '') {
        $.ajax({
                type: 'post',
                url: UI_URL + 'message',
                data: {content: $('#newmessage')[0].value, id: $('#businessid')[0].innerHTML, from: "wing"},
                success: function (data) {
                    para = document.createElement("div")
                    mhtml = "<div class='senderWing'>" + $('#newmessage')[0].value + "<br><small>" + dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +" " +dt.toLocaleTimeString('en-US') + "</small></div><br>";
                    para.innerHTML = mhtml
                    document.getElementById("mlist").appendChild(para)
                    $('#newmessage')[0].value = ""
                },
                error: function(err) {
                    $('#newmessage')[0].value = "Error Sending Message. Please try later";
                }
              });
     }
}

function displaylist(data) {
    count = 1
    for(i in data) {
        console.log(data[i])
        detail = data[i]
        row = document.createElement("tr")
        row.colspan = "7"
        row.style = "height: 40px"

        startdate = new Date(detail.businessStartDate)
        status = detail.status
        statusclass = "badge-success"
        if (status == "Ended") {
            statusclass = "badge-danger"
        } else if (status == "Pending") {
            statusclass = "badge-secondary"
        }


        innerhtml = "<td><strong>"+count+"</strong></td>"
        innerhtml += "<td>"+detail.businessName+"</td>"
        innerhtml += "<td>" + startdate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) + "</td>"
        innerhtml += "<td><span class='badge light "+ statusclass +"'>"+detail.status+"</span></td>"
        innerhtml += "<td>"+ detail.managerName+"</td>"
        innerhtml += "<td><button id='"+detail.businessId+"' onclick='buttonclick(this.id)' style='border: 0px;'>"
        innerhtml += "<img src='./images/profile2.jpg' style='max-width: 40px;' /></button></td>"
        expandid = "demo" + i
        innerhtml += "<td><h2 data-toggle='collapse' data-target='#"+ expandid+"' class='accordion-toggle collapsible' style='padding:5px'>"
        innerhtml += "<center>+</center></h2></td>"

        row.innerHTML = innerhtml

        rowexpand = document.createElement("tr")
        rowexpand.class = "p"
        int12 = "<td colspan='7' class='hiddenRow'>"
        int12 += "<div class='accordian-body collapse p-3' id='"+expandid+"'>"
        int12 += "<div class='card' style='width: 40%'>"
        int12 += "<div class='card-body light badge-secondary' style='border-radius: 12px'>"
        int12 += "<strong>"+detail.businessName+"</strong>"
        int12 += "<div style='border: 1px solid black'></div><br>"
        int12 += "<div style='margin-top: 3px'>Bling phone Number: "+ detail.blingPhoneNumber+"</div>"
        int12 += "<div>Plan Price: $"+detail.pricePlan+"</div"
        int12 += "</div>"
        int12 += "</div></div></td>"

        rowexpand.innerHTML = int12

        page = document.getElementById("blist")
        page.appendChild(row)
        page.appendChild(rowexpand)
        count += 1
    }
}

function displayprofile(data) {
    detail = data.business

    document.getElementById("businessname").innerHTML = detail.businessname
    mdetail = detail.managerName
    if (mdetail == null) {
        mdetail = ""
    }
    document.getElementById("manager").innerHTML = mdetail+ "<br>" +detail.managerEmail+"<br>"+detail.managerPhonenumber+"<button id='editmanager'><img src='./images/pen.png' style='max-width: 20px;'/></button><div>"

    document.getElementById("owner").innerHTML = detail.primaryphonenumber + "<br>" + detail.website + "<br>" + detail.owneremail

    document.getElementById("price").innerHTML = "$" + detail.price
    document.getElementById("outbound").innerHTML = detail.outboundcall
    document.getElementById("inbound").innerHTML = detail.inboundcall
    document.getElementById("email").innerHTML = detail.email
    document.getElementById("message").innerHTML = detail.message
    document.getElementById("survey").innerHTML =detail.survey

    phtml = "<img src='./images/blingnumber.jpg' style='max-width: 40px; margin-bottom: 10px'/>" + detail.blingphonenumber
//    document.getElementById("blingnum").innerHTML = phtml
    document.getElementById("greeting").innerHTML = detail.welcomemessage
    document.getElementById("voicemail").innerHTML = detail.closedbizmessage

    para = document.createElement("p")
    para.innerHTML = detail.managerName + ";" + detail.managerPhonenumber + ";" + detail.managerEmail
    para.style.display = "none"
    para.id = "managerhiddendetail"
    document.body.appendChild(para)

    para = document.createElement("p")
    para.innerHTML = detail.businessId
    para.style.display = "none"
    para.id = "businessid"
    document.body.appendChild(para)

//    editmanagerdetails()

}

function cleanup() {
    document.getElementById("businessname").innerHTML = ""
    document.getElementById("manager").innerHTML = ""
}

function displaymessage(data) {
    mhtml = ""
    for (i in data) {
        msg = data[i]

        dt = new Date(msg.createdDate)

        if (msg.messageFrom == "wing") {
            mhtml += "<div style='display: flex; display-direction: row; margin: 5px; margin-bottom: 10px; border-bottom: 1px solid black'><img src='./images/winglogo.jpeg' style='width: 20px; height: 20px'/><div class='senderWingNew'>" + msg.messagecontent + "<br><small>" + dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) + " " +dt.toLocaleTimeString('en-US') + "</small></div></div>";
        } else {
            mhtml += "<div style='display: flex; display-direction: row; margin: 5px; margin-bottom: 10px; border-bottom: 1px solid black'><img src='./images/bling_logo.png' style='max-width: 40px; height: 20px'/><div class='senderBlingNew'>" + msg.messagecontent + "<br><small>" + dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) + " " + dt.toLocaleTimeString('en-US') + "</small></div></div>";
        }
    }
    if (mhtml == ""){
        mhtml = "<p style='padding:20px'><center><strong>No Messages Exchanged. <br><br>Send a message to start conversation.</strong></center></p>"
    }

    document.getElementById("mlist").innerHTML = mhtml
}

function displaydetails(data) {
    document.getElementById("script").innerHTML = data.script
}

function edit() {
    $('#editscript').hide()
    $('#updateScript').show()
    document.getElementById('script').style.backgroundColor = "white"
    document.getElementById('script').readOnly = false
}

function savescript() {
    $.ajax({
        type: 'post',
        url: UI_URL + 'script',
        data: {content: $('#script')[0].value, id: $('#businessid')[0].innerHTML},
        success: function (data) {
            cancel()
        },
        error: function(err) {
            document.getElementById("updating").innerHTML = "Error Updating. Please try later";
        }
      });
}

function cancel() {
    $('#editscript').show()
        $('#updateScript').hide()
        element = document.getElementById('script')
        element.style.backgroundColor = "#DCDCDC"
        element.readOnly = true
}

function inbounddata(data) {
        inhtml = ""
        count = 1
        for (i in data) {
            call = data[i]
            dt = new Date(call.createdDate)
            inhtml += "<tr><td>" + count +"</td><td>" +call.customerPhoneNumber+"</td><td> <audio controls style='width: 150px;'>"
            inhtml += "<source src='"+call.recordUrl+"'></audio> </td><td>"+ dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })+"</td></tr>"
            count += 1
        }

        document.getElementById("incall").innerHTML = inhtml
}

function outbounddata(data) {

        console.log("Mallika outbound call")
        console.log(data)
        outhtml = ""
        for (i in data) {
            call = data[i]
            dt = new Date(call.createdDate)
            outhtml += "<div style='display: flex; display-direction: row; padding:5px;'>"
            if (call.callstatus == 'Inbound Call') {
             outhtml += "<div><img src='./images/inboundcalls.png' width=40px /></div>"
            } else {
                outhtml += "<div><img src='./images/outbound.png' width=40px /></div>"
            }
            outhtml += "<div style='margin-left:5px;'><normal style='font-family: cambria'>"+call.customerPhoneNumber+"</normal><br>"
            if (call.callstatus == 'Inbound Call') {
             outhtml += "<h5 style='font-family: cambria; margin: 5px'>"+call.callNote +"</h5>"
            }
            outhtml += "<small>" +dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })+"</small></div>"
            outhtml +="</div>"
            outhtml += "<div><audio controls style='height: 30px; margin-left: 40px; margin-bottom: 10px'><source src='"+call.recordUrl+"'></audio></div>"

        }
        document.getElementById("outcall").innerHTML = outhtml
}

function searchPanel() {
    $('#callolist').hide()
    $('#searcholist').show()
    $('#searchoutnum').show()
}

function searchoutbound() {
    $('#searchoutnum').hide()
    $('#loaderout').show()
    $('#outerror').hide()
    $.ajax({
        type: 'get',
        url: UI_URL + 'outbound/search/' + $('#searchoutnum')[0].value,
        success: function (data) {
            $('#loaderout').hide()
            $('#backoutlist').show()
            cancelout()
            outbounddata(data)
        },
        error: function(err) {
            $('#loaderout').hide()
            $('#searchoutnum').show()
            $('#outerror').show()
        }
      });
}

function cancelout() {
    $('#searcholist').hide()
    $('#callolist').show()
    $('#outerror').hide()
}

function backoutbound() {
    $('#loaderout').show()
    $('#backoutlist').hide()
    $.ajax({
        type: 'get',
        url: UI_URL + 'outbound/' + $('#businessid')[0].innerHTML,
        success: function (data) {
        $('#loaderout').hide()
         outbounddata(data)
        }
      });
}