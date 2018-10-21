$(document).ready(function(){

    var lat = "";
    var lng = "";
    var temp = "";

    $("#postdiv").hide();
    $("#messagesdiv").hide();

    $("#submitmessage").click(function(){
        var message = $("#message").val();
        $("#message").val('');
        var parentid = 0;
        submitmessage(message, "#div1", parentid);
    });

    $("#login").click(function(){
        $("#postdiv").show();
        $("#messagesdiv").show();
        $("#login").hide();

        //https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyD9fdkz_Ho3Bmp-IAYxwJPAz_ScY_h06bY

        var selectedcity = $('#cityId').val();
        if(selectedcity){
            $.ajax(
                {
                    url: "https://maps.googleapis.com/maps/api/geocode/json?address="+selectedcity+"&key=AIzaSyD9fdkz_Ho3Bmp-IAYxwJPAz_ScY_h06bY",
                    type: "GET",
                    success: function(result){
                        console.log(result.results[0].geometry.location);
                        var latlng = result.results[0].geometry.location;
                        lat = latlng.lat;
                        lng = latlng.lng;
                        console.log(latlng);
                        //https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=72eeeec78b410d8013505a0340c687e9
                        $.ajax(
                            {
                                url: "https://api.openweathermap.org/data/2.5/weather?lat="+latlng.lat+"&lon="+latlng.lng+"&appid=72eeeec78b410d8013505a0340c687e9&units=metric",
                                type: "GET",
                                success: function(result){
                                    console.log(result.main.temp);
                                    temp = result.main.temp;
                                    $("#resultdiv").html("<small>Lat "+latlng.lat + " Lng " + latlng.lng + " " + result.main.temp + " C</small>");
                                }
                            }
                        );

                    }
                }
            );
        }

        var username = $("#username").val();
        $.ajax(
            {
                url: "/api/getmessages", 
                type: "POST",
                data: {"username": username},
                success: function(result){
                    console.log(result);

                    for(var i=0; i< result.length; i++){
                        if(result[i].parentid==0){
                            var divhtml = $("#div1").html();
                            divhtml += "<div class='someclass' id='id"+result[i].id+"'>";
                            divhtml += "<strong>" + result[i].message + "</strong> - <small>" + result[i].created_date 
                            + " - " + result[i].username
                            + " - lat " + result[i].lat
                            + " - lng " + result[i].lng
                            + " - " + result[i].temp + "C</small>";
                            divhtml += " <a class='replylink' id='"+result[i].id+"' href='#' '>Reply</a>";
                            divhtml += "<div class='someclass' id='child"+result[i].id+"'></div>";
                            divhtml += "</div>";
                            $("#div1").html(divhtml);
                        }else{
                            var divhtml = $("#child"+result[i].parentid).html();
                            divhtml += "<div class='someclass' id='id"+result[i].id+"'>";
                            divhtml += "<strong>" + result[i].message + "</strong> -  <small>" + result[i].created_date 
                            + " - " + result[i].username
                            + " - lat " + result[i].lat
                            + " - lng " + result[i].lng
                            + " - " + result[i].temp + "C</small>";
                            divhtml += " <a class='replylink' id='"+result[i].id+"' href='#' '>Reply</a>";
                            divhtml += "<div class='someclass' id='child"+result[i].id+"'></div>";
                            divhtml += "</div>";
                            $("#child"+result[i].parentid).html(divhtml);
                        }
                    }
                    
                }
            }
        );
    });

    $('body').on('click', 'a.replylink', function() {
        var id = $(this).attr('id');
        console.log(id);
        var posthtml = '<input name="message'+id+'" id="message'+id+'" type="text"><button class="postreply" id="'+id+'" type="button">Post</button>';
        $("#child"+id).html(posthtml);
    });

    $('body').on('click', 'button.postreply', function() {
        var id = $(this).attr('id');
        var parentid = id;
        console.log(id);
        var message = $("body").find('input[name="message'+id+'"]').val()
        console.log(message);
        $("#child"+id).html("");
        submitmessage(message, "#child"+id, parentid);
    });


    function submitmessage(message, postdiv, parentid){
        var username = $("#username").val();
        console.log(message);
        $.ajax(
            {
                url: "/api/postmessage", 
                type: "POST",
                data: {"message": message, "username": username, "parentid": parentid, "lat": lat, "lng": lng, "temp": temp},
                success: function(result){
                    var i=0;    
                    var divhtml = $(postdiv).html();
                    divhtml += "<div class='someclass' id='id"+result[i].id+"'>";
                    divhtml += "<strong>" + result[i].message + "</strong> - <small>" + result[i].created_date + " - " 
                    + result[i].username
                    + " - lat " + result[i].lat
                    + " - lng " + result[i].lng
                    + " - " + result[i].temp + "C</small>";
                    divhtml += " <a class='replylink' id='"+result[i].id+"' href='#' '>Reply</a>";
                    divhtml += "<div class='someclass' id='child"+result[i].id+"'></div>";
                    divhtml += "</div>";                    
                    $(postdiv).html(divhtml);
                }
            }
        );        
    }

});

