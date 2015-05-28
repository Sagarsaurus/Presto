/**
 * Created by sagarsaurus on 5/26/15.
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handle_errors);
    }   else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    //console.log(latitude);
    //console.log(longitude);
    alert("Latitude is: "+latitude+"\nand Longitude is: "+longitude);
    updateNews('Atlanta');
}

function handle_errors(error)
{
    switch(error.code)
    {
        case error.PERMISSION_DENIED: alert("We could not gather your location.  Please make sure location services are enabled in your browser.");
            break;

        case error.POSITION_UNAVAILABLE: alert("Unable to detect current position.");
            break;

        case error.TIMEOUT: alert("Timed out trying to detect current position.");
            break;

        default: alert("unknown error");
            break;
    }
}

//update this to take in news type in the future, remove call in showPosition once sunny finishes dropdown
function updateNews(city) {
    var xmlhttp = new XMLHttpRequest();
    var nameValuePairs = 'city='+city;
    xmlhttp.open("POST", "api/getNews", false); //AJAX Set request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   // xmlhttp.setRequestHeader("Content-length", nameValuePairs.length);
    xmlhttp.send(nameValuePairs);

    var response = JSON.parse(xmlhttp.responseText);
    var news = document.getElementById('news');
    document.getElementById('newsDiv').style.visibility="visible";
    var toSet = "";
    for(var i = 0; i < response['message']['d']['results'].length; i++) {
        var item = response['message']['d']['results'][i];
        toSet+='<div class="item"> <i class="newspaper icon"></i> <div class="content"> <a class="header">'+item['Title']+'</a> <div class="description">'+item['Description'].replace(/^(.{100}[^\s]*).*/, "$1")+'...</div> </div> </div>';
    }

    toSet+='</div>';
    news.innerHTML = toSet;
}



