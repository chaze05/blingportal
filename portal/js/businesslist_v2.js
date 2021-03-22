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

        page = document.getElementById("blist")
//        page.appendChild(link)
        count += 1
    }
}