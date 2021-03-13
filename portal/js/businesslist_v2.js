//UI_URL= "http://localhost:8080/business/"
UI_URL = "https://www.bling-center.com/business/"

$('.accordion-toggle').click(function(){
	$('.hiddenRow').hide();
	$(this).next('tr').find('.hiddenRow').show();
});

$(document).ready(function() {
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

function buttonclick(id) {
    consoloe.log("+ button clicked")
    document.getElementById("expand_" + id).style.display = "block"
}

function displaylist(data) {
    count = 1
    for(i in data) {
        console.log(data[i])
        detail = data[i]
                startdate = new Date(detail.businessStartDate)
                status = detail.status
                statusclass = "badge-success"
                if (status == "Ended") {
                    statusclass = "badge-danger"
                } else if (status == "Pending") {
                    statusclass = "badge-secondary"
                }


        link = document.createElement("div")
        link.className = "a1"
        link.style = "margin-top: 20px"
        expandid="expand_" + detail.businessId;

        html = "<span></span><span></span><span></span><span></span>"
        html += "<div style='display: flex;'><div style='width: 10%'><strong>"+count+"</strong></div>"
        html += "<div style='width: 25%; padding-left: 10px'>"+detail.businessName+"</div>"
        html += "<div style='width: 15%'>"+startdate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })+"</div>"
        html += "<div style='width: 10%; margin-left: 10px; margin-right: 10px' class='badge light "+ statusclass +"'>"+detail.status+"</div>"
        html += "<div style='width: 15%'>"+detail.managerName+"</div>"
        html += "<div style='width: 15%'><button id='"+detail.businessId+"' style='border: 0px;background-color: Transparent; color: yellow'>"
        html += "<strong>View Profile</strong></button></div>"
        html += "<div style='width: 5%; font-size: 20px'><button style='border: 0px;background-color: Transparent; color: yellow' onclick='buttonclick("+detail.businessId+")'>+</button></div></div>"
        html += "<div id="+expandid+" style='height: 100px; display: none'></div>"

        link.innerHTML = html;

//        row = document.createElement("tr")
//        row.colspan = "7"
//        row.style = "height: 40px"
//


//        innerhtml = "<td><strong>"+count+"</strong></td>"
//        innerhtml += "<td>"+detail.businessName+"</td>"
//        innerhtml += "<td>" + startdate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) + "</td>"
//        innerhtml += "<td><span class='badge light "+ statusclass +"'>"+detail.status+"</span></td>"
//        if (detail.managerName != null) {
//            innerhtml += "<td>"+ detail.managerName+"</td>"
//        } else {
//            innerhtml += "<td>Not Available</td>"
//        }
//        innerhtml += "<td><button id='"+detail.businessId+"' onclick='buttonclick(this.id)' style='border: 0px;'>"
//        innerhtml += "<img src='./images/profile2.jpg' style='max-width: 40px;' /></button></td>"
//        expandid = "demo" + i
//        innerhtml += "<td><h2 data-toggle='collapse' data-target='#"+ expandid+"' class='accordion-toggle collapsible' style='padding:5px'>"
//        innerhtml += "<center>+</center></h2></td>"
//
//        row.innerHTML = innerhtml
//
//        rowexpand = document.createElement("tr")
//        rowexpand.class = "p"
//        int12 = "<td colspan='7' class='hiddenRow'>"
//        int12 += "<div class='accordian-body collapse p-3' id='"+expandid+"'>"
//        int12 += "<div class='card' style='width: 40%'>"
//        int12 += "<div class='card-body light badge-secondary' style='border-radius: 12px'>"
//        int12 += "<strong>"+detail.businessName+"</strong>"
//        int12 += "<div style='border: 1px solid black'></div><br>"
//        int12 += "<div style='margin-top: 3px'>Bling phone Number: "+ detail.blingPhoneNumber+"</div>"
//        int12 += "<div>Plan Price: $"+detail.pricePlan+"</div"
//        int12 += "</div>"
//        int12 += "</div></div></td>"
//
//        rowexpand.innerHTML = int12

        page = document.getElementById("blist")
        page.appendChild(link)
        count += 1
    }
}