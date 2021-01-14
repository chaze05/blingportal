$('.accordion-toggle').click(function(){
	$('.hiddenRow').hide();
	$(this).next('tr').find('.hiddenRow').show();
});

function buttonclick(id) {
    $('#businesslist').hide();
    $('#profiledetails').show();
    $.ajax({
            type: 'get',
            url: 'http://localhost:8080/business/profile/' + id,
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
        url: 'http://localhost:8080/business/list/wing',
        success: function (data) {
         displaylist(data.data)
        }
      });
})

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
    document.getElementById("manager").innerHTML = detail.managerName
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


    mhtml = "<div style='padding: 5px; font-size: 13px' ><span class='dot' style='color: white'> Jan 2</span><br>"
    mhtml += "Hello my name is</div>"
    document.getElementById("mlist").innerHTML = mhtml


    inhtml = "<tr><td>1</td><td>11234567890</td><td> <audio controls style='width: 150px'>"
    inhtml += "<source src={{inbound.recordUrl}}></audio> </td><td>Jan 2</td></tr>"
    document.getElementById("incall").innerHTML = inhtml

    outhtml = "<tr><td>1</td><td>11234567890</td><td> <audio controls style='width: 150px'>"
    outhtml += "<source src={{inbound.recordUrl}}></audio> </td><td>Jan 2</td></tr>"
    document.getElementById("outcall").innerHTML = outhtml

    document.getElementById("script").innerHTML = "scripting....."

}