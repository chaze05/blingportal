$('.accordion-toggle').click(function(){
	$('.hiddenRow').hide();
	$(this).next('tr').find('.hiddenRow').show();
});

function buttonclick() {
    $('#businesslist').hide();
    $('#profiledetails').show();
}

function backbusiness() {
    $('#businesslist').show();
    $('#profiledetails').hide();
}

$(document).ready(function() {
    $('#profiledetails').hide();
$('[data-toggle="tooltip"]').tooltip();
html_val = '<em>Email</em> : <b>Email Val</b><br>'
html_val += '<em>Phone Number</em> : <b>num Val</b>'
$('#manager').attr('data-original-title', html_val)
})