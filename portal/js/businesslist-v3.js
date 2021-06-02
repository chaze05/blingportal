//UI_URL= "http://localhost:8080/business/"
UI_URL = "https://www.bling-center.com/business/"

$('.accordion-toggle').click(function(){
//    console.log("Malika")
	$('.hiddenRow').hide();
	$(this).next('tr').find('.hiddenRow').show();
});

function buttonclick(id) {
   window.location = 'profile-action.html?id=' + id;
}

$(document).ready(function() {

    $.ajax({
        type: 'get',
        url: UI_URL + 'list/wing',
        success: function (data) {
         $('#loader').hide()
         displaylist(data.data)
        },
        error: function(err) {
            $('#blistload').hide()
            $('#blistcard').show()
        }
      });
})

function displaylist(data) {
    count = 1
    for(i in data) {
//        console.log(data[i])
        detail = data[i]
        row = document.createElement("tr")
        row.style = "background-color: rgba(100, 100, 100, 0.3); "

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
        innerhtml += "<td><span class='badge light "+ statusclass +"' style='color: black'>"+detail.status+"</span></td>"
        if (detail.managerName == null) {
        innerhtml += "<td>-</td>"
        } else {
        innerhtml += "<td>"+ detail.managerName+"</td>"
        }
        innerhtml += "<td><button class='button-class' id='"+detail.businessId+"' onclick='buttonclick(this.id)' style='border: 0px; outline: none'>"
        innerhtml += "<img src='./images/PngItem_786293.png' style='max-width: 40px;' /></button></td>"
        expandid = "demo" + i
        innerhtml += "<td><h2 data-toggle='collapse' data-target='#"+ expandid+"' class='accordion-toggle collapsible' style='padding:0px; margin: 0px; background-color: Transparent;'>"
        innerhtml += "<button class='button-class' style='border: 0px; outline: none;'>...</button></h2></td>"

        row.innerHTML = innerhtml

        rowexpand = document.createElement("tr")
        rowexpand.class = "p"
        bpno = detail.blingPhoneNumber
        bprice = detail.pricePlan
        if (bpno == null) {
            bpno = "Not Assigned till now"
        }
        if (bprice == null) {
            bprice = "N/A"
        }
        int12 = "<td colspan='7' class='hiddenRow'>"
        int12 += "<div class='accordian-body collapse p-3' id='"+expandid+"'>"
        int12 += "<div style='width: 40%;color: black'>"
        int12 += "<div style='border-radius: 12px;padding: 15px; background-color: #ffe600;'>"
        int12 += "<strong>"+detail.businessName+"</strong>"
        int12 += "<div style='border: 1px solid black'></div><br>"
        int12 += "<div style='margin-top: 3px'>Bling phone Number: "+ bpno+"</div>"
        int12 += "<div>Plan Price: $"+bprice+"</div>"
        int12 += "</div>"
        int12 += "</div></div></td>"

        rowexpand.innerHTML = int12

        page = document.getElementById("blist")
        page.appendChild(row)
        page.appendChild(rowexpand)
        count += 1
    }
}

function search() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("blist");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td === undefined) {
            tr[i].style.display = "none";
            continue;
        }
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i++].style.display = "";
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function signup() {
    window.location = 'signup.html';
}