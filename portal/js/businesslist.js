UI_URL= "http://localhost:8080/business/"
//UI_URL = "https://www.bling-center.com/business/"

$('.accordion-toggle').click(function(){
	$('.hiddenRow').hide();
	$(this).next('tr').find('.hiddenRow').show();
});

function buttonclick(id) {
    $('#businesslist').hide();
    $('#profiledetails').show();
    $.ajax({
            type: 'get',
            url: UI_URL + 'profile/' + id,
            success: function (data) {
             console.log(data)
             $('#loader').hide()
             $('#bcard').show()
             displayprofile(data.data)
            }
          });
}

function backbusiness() {
    $('#businesslist').show();
    $('#profiledetails').hide();
    $('#loader').show()
    $('#bcard').hide()
}

$(document).ready(function() {
    $('#profiledetails').hide();
$('[data-toggle="tooltip"]').tooltip();
$('#bcard').hide();

    $.ajax({
        type: 'get',
        url: UI_URL + 'list/wing',
        success: function (data) {
         displaylist(data.data)
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
                document.getElementById("manager").innerHTML = mdetail+ "<button id='editmanager'><img src='./images/pen.png' style='max-width: 20px;'/></button>"
                html_val = '<em>Email</em> : <b>'+ $('#formmanageremail')[0].value+'</b><br>'
                html_val += '<em>Phone Number</em> : <b>'+$('#formmanagernum')[0].value+'</b>'
                $('#manager').attr('data-original-title', html_val)
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
    $.ajax({
                type: 'post',
                url: UI_URL + 'message',
                data: {content: $('#newmessage')[0].value, id: $('#businessid')[0].innerHTML, from: "wing"},
                success: function (data) {
                    para = document.createElement("div")
                    para.style = "padding: 5px; font-size: 10px"
                    color = "<span class='dot' style='color: white'>"
                    mhtml = color +new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })+"</span><br>"
                    mhtml += "<div style='font-size: 13px'>" + $('#newmessage')[0].value + "</div>"
                    para.innerHTML = mhtml
                    document.getElementById("mlist").appendChild(para)
                    $('#newmessage')[0].value = ""
                },
                error: function(err) {
                    $('#newmessage')[0].value = "Error Sending Message. Please try later";
                }
              });
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
        int12 += "<div class='accordian-body collapse p-3' id='"+expandid+"'>Mallika.......</div></td>"

        rowexpand.innerHTML = int12

        page = document.getElementById("blist")
        page.appendChild(row)
        page.appendChild(rowexpand)
        count += 1
    }
}

function displayprofile(data) {
    detail = data.business
    messages = data.businessMessageList
    inbound = data.inboundCalls
    outbound = data.outboundCalls
    script = data.businessScript

    document.getElementById("businessname").innerHTML = detail.businessname
    mdetail = detail.managerName
    if (mdetail == null) {
        mdetail = ""
    }
    document.getElementById("manager").innerHTML = mdetail+ "<button id='editmanager'><img src='./images/pen.png' style='max-width: 20px;'/></button>"
    html_val = '<em>Email</em> : <b>'+ detail.managerEmail+'</b><br>'
    html_val += '<em>Phone Number</em> : <b>'+detail.managerPhonenumber+'</b>'
    $('#manager').attr('data-original-title', html_val)

    document.getElementById("price").innerHTML = "$" + detail.price
    document.getElementById("callType").innerHTML = "MallikaManager"
    document.getElementById("email").innerHTML = "Emails  "
    document.getElementById("message").innerHTML = "Messages  "
    document.getElementById("survey").innerHTML = "Surveys  "

    phtml = "<img src='./images/blingnumber.jpg' style='max-width: 40px; margin-bottom: 10px'/>" + detail.blingphonenumber
    document.getElementById("blingnum").innerHTML = phtml
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

    mhtml = ""
    for (i in messages) {
        msg = messages[i]
        dt = new Date(msg.createdDate)
        color = "<span class='dotbling' style='color: black'>"
        if (msg.messageFrom == "wing") {
            color = "<span class='dot' style='color: white'>"
        }
        mhtml += "<div style='padding: 5px; font-size: 10px' >"+ color +
                        dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })+"</span><br>"
        mhtml += "<div style='font-size: 13px'>" + msg.messagecontent + "</div></div>"
    }

//    for (i=0; i<20; i++) {
//            mhtml += "<div style='padding: 5px; font-size: 10px' ><span class='dotbling' style='color: black'> Jan 2+</span><br>"
//            mhtml += "<div style='font-size: 13px'>Hello</div></div>"
//        }
    document.getElementById("mlist").innerHTML = mhtml

    inhtml = ""
    count = 0
    for (i in inbound) {
        call = inbound[i]
        dt = new Date(call.createdDate)
        inhtml += "<tr><td>" + count +"</td><td>" +call.customerPhoneNumber+"</td><td> <audio controls style='width: 150px'>"
        inhtml += "<source src='"+call.recordUrl+"'></audio> </td><td>"+ dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })+"</td></tr>"
        count += 1
    }

    document.getElementById("incall").innerHTML = inhtml


    outhtml = ""
    count = 0
    for (i in outbound) {
        call = outbound[i]
        dt = new Date(call.createdDate)
        inhtml += "<tr><td>" + count +"</td><td>" +call.customerPhoneNumber+"</td><td> <audio controls style='width: 150px'>"
        inhtml += "<source src='"+call.recordUrl+"'></audio> </td><td>"+ dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })+"</td></tr>"
        count += 1
    }
    document.getElementById("outcall").innerHTML = outhtml

    document.getElementById("script").innerHTML = script
    editmanagerdetails()

}