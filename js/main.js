$(function(){
    $('.withChild').on('click', function() {
        var text = $(this).data("area");
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $(this).next('ul').slideUp();
        }else{
            $('.mainParent li .withChild').removeClass('active notactive');
            $('.mainParent li .withChild + ul').slideUp();
             $('.submenu a').removeClass('active')
            $(this).addClass('active');
            $(this).next('ul').slideDown();
        }
        $('.area').text(text);
    });
    $('.submenu li a').on('click',function(){
        var text = $(this).data("area");
        if($(this).hasClass('active')){
            $(this).removeClass('active')
        }else{  
            $(this).parents('li').find('.withChild').addClass('active notactive')
            $('.submenu li a').removeClass('active');
            $(this).addClass('active');
        }
            $('.area').text(text);
    })

    $('.slideHolder').on('click', function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $(this).text("OFF");
        }else{
            $(this).addClass('active');
            $(this).text("ON");
        }
    })


    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
    let datenow = new Date();
    let month = datenow.getMonth();
    let  day = datenow.getDate();
    let rawDate = [];
    let rawClass = []
    var uniqueDate;
    var uniqueClass;

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    // getData();
    // function getHeader(){
    //     var element = "";
    //     for(var i in uniqueDate){
    //         element = '<div class="heading '+uniqueClass[i]+'">'+
    //         '<h3>Calls For '+uniqueDate[i]+'</h3><a href="#" data-date='+uniqueDate[i]+' class="btnGet">Get Data</a></div>';
    //         $(element).appendTo('.dsahboard1');
    //         $(element).appendTo('.dsahboard2');
    //     }
    //     console.log(uniqueDate);
    // }
    // getHeader();

    // function dataGetter(){
    //     for(var j in uniqueDate){
    //         $.getJSON("https://www.bling-center.com/business/inbound/calldetail/amicpa", function(data){
    //             for(var i in data){
    //                 var dateNow = new Date(data[i].createdDate);
    //                 var checker = monthNames[dateNow.getMonth()]+'-'+dateNow.getDate()+'-'+ dateNow.getFullYear();
    //                 rawDate.push(checker);
    //                 rawClass.push(monthNames[dateNow.getMonth()]+dateNow.getDate());
    //                 uniqueDate = rawDate.filter(onlyUnique);
    //                 uniqueClass = rawClass.filter(onlyUnique);
    //             }});
    //             if(uniqueDate[j] == checker){
    //                 var dataBox = '<span class="Phone Number"'+data[i].customerPhoneNumber+'</span>';
    //                 $(dataBox).appendTo(".August17");
    //                 if(uniqueDate[j] == checker){
    //                     var dataBox = '<span class="Phone Number"'+data[i].customerPhoneNumber+'</span>';
    //                     console.log(dataBox);
    //                     $(dataBox).appendTo(".August17");
    //                 }
    //             }
    //     }
    // }
    // dataGetter()
    getByDate()
    function getByDate(){
        var dataBox="";
        $.getJSON("https://www.bling-center.com/business/inbound/calldetail/amicpa", function(data){
            console.log(data)
            var currentProcessDate ="";
            for(var i in data){
                var date = data[i].createdDate.split("T")[0];
                if(currentProcessDate == "" || currentProcessDate != date){
                    element = '<h3>Calls For '+date+'</h3>';
                    $('.dashboard').append(element);
                    currentProcessDate = date;
                }
                dataBox = '<div class="divDetails">'+
                    '<ul>'+
                    '<li>'+
                        '<span class="data">'+data[i].customerPhoneNumber+'</span>'+
                        '<span class="legend">Phone Number</span>'+
                    '</li>'+
                    '<li>'+
                        '<span class="data">'+data[i].callstatus+'</span>'+
                        '<span class="legend">call status</span>'+
                    '</li>'+
                    '<li>'+
                        '<span class="data colored '+data[i].callType+'">'+ data[i].callType +'</span>'+
                        '<span class="legend">callType</span>'+
                    '</li>'+
                    '<li>'+
                        '<audio controls>'+
                            '<source src="'+data[i].recordUrl+'" type="audio/mpeg">'+
                        ' Your browser does not support the audio element.'+
                        ' </audio>'+
                    '</li>'+
                    '</ul>'+
                '</div>';  
                $(dataBox).appendTo('.dashboard');  
            }
        })
    }
    $('#number').keyup(function(){
        var number= $(this).val();
        if(number ==""){
            $('#dashboard').html('')
            getByDate()
        }
        $('#dashboard').html('')
        search(number);
    });
    function search(mobile){
            $.getJSON("https://www.bling-center.com/business/inbound/calldetail/amicpa", function(data){
            var currentProcessDate ="";
            $.each(data, function(key,value){
                var date = value.createdDate.split("T")[0];
                var customernum = value.customerPhoneNumber;
                if(customernum == mobile){
                    if(currentProcessDate == "" || currentProcessDate != date){
                        element = '<h3>Calls For '+date+'</h3>';
                        $('.dashboard').append(element);
                        currentProcessDate = date;
                    }
                    dataBox = '<div data-key="'+key+'" class="divDetails" >'+
                        '<ul>'+
                        '<li>'+
                            '<span class="data" data-date="'+date+'">'+value.customerPhoneNumber+'</span>'+
                            '<span class="legend">Phone Number</span>'+
                        '</li>'+
                        '<li>'+
                            '<span class="data">'+value.callstatus+'</span>'+
                            '<span class="legend">call status</span>'+
                        '</li>'+
                        '<li>'+
                            '<span class="data colored '+value.callType+'">'+ value.callType +'</span>'+
                            '<span class="legend">callType</span>'+
                        '</li>'+
                        '<li>'+
                            '<audio controls>'+
                                '<source src="'+value.recordUrl+'" type="audio/mpeg">'+
                            ' Your browser does not support the audio element.'+
                            ' </audio>'+
                        '</li>'+
                        '</ul>'+
                    '</div>';  
                    $('.dashboard').append(dataBox);
                }


            })

            // for(var i in data){
            //     var date = data[i].createdDate.split("T")[0];
            //     var customernum = data[i].customerPhoneNumber;

            //     if(customernum == mobile){
            //         element = '<h3>Calls For'+date+'</h3>';
            //         $('.dashboard').append(element);
            //     }
            //     dataBox = '<div class="divDetails">'+
            //         '<ul>'+
            //         '<li>'+
            //             '<span class="data">'+data[i].customerPhoneNumber+'</span>'+
            //             '<span class="legend">Phone Number</span>'+
            //         '</li>'+
            //         '<li>'+
            //             '<span class="data">'+data[i].callstatus+'</span>'+
            //             '<span class="legend">call status</span>'+
            //         '</li>'+
            //         '<li>'+
            //             '<span class="data">'+data[i].callstatus+'</span>'+
            //             '<span class="legend">call status</span>'+
            //         '</li>'+
            //         '<li>'+
            //             '<span class="data colored '+data[i].callType+'">'+ data[i].callType +'</span>'+
            //             '<span class="legend">callType</span>'+
            //         '</li>'+
            //         '<li>'+
            //             '<audio controls>'+
            //                 '<source src="'+data[i].recordUrl+'" type="audio/mpeg">'+
            //             ' Your browser does not support the audio element.'+
            //             ' </audio>'+
            //         '</li>'+
            //         '</ul>'+
            //     '</div>';  
            //     $(dataBox).appendTo('.dashboard');  
        //     }
        // })
    })}
    
    $('.mainContent ').delegate('.btnGet','click', function(){
        event.preventDefault();
        var selData = $(this).data('date')
        var divname =$(this).parent().data('class')
        $(this).fadeOut();
        getByDate(selData,divname);
    })
});



var sec = -1;
function pad(val) { return val > 9 ? val : "0" + val; }

function timer(seconds,minutes,hours){
    setInterval(function () {
        $("#"+seconds).html(pad(++sec % 60));
        $("#"+minutes).html(pad(parseInt(sec / 60, 10) % 60));
        $("#"+hours).html(pad(parseInt(sec / 3600, 10)));
    }, 1000);
    console.log(seconds+" "+minutes+" "+hours)
}
$('.mainParent li a').on('click',function(){
    var divShow = $(this).data("area");
    console.log(divShow);
    if(divShow){
        $('.areaBox').fadeOut();
        $("#"+divShow).fadeIn();

    }
});
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
function formatDate() {
    var datenow = new Date();
    var month = datenow.getMonth()+1;
    var date = datenow.getDate();
    var year = datenow.getFullYear();
    var dateSent =   month+"/"+date+"/"+year;
    return dateSent;
}
$('.send').on('click',function(E){
    E.preventDefault();
    var dateNow = new Date();
    var message = $(this).parent().find('textarea').val()
    var reply ='<div class="replyBox">'+
                    '<span class="message">'+message+'</span>'+
                    '<img src="img/pic.png" alt="">'+
                    '<span class="time">'+formatAMPM(dateNow)+"   "+formatDate() +'</span>'+
               '</div>';
    $('.messageArea').append(reply);
    $(this).parent().find('textarea').val('');
});
$('.typeArea textarea').on('keyup',function(e){
    if (e.keyCode === 13) {
    event.preventDefault();
    $('.send').click();
  }
})
