/**
 * Created by sagarsaurus on 5/26/15.
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(reportLocation, handle_errors);
    }   else {
        alert("Geolocation is not supported by this browser.");
    }
}

function reportLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    //do something with coordinates, perhaps return as string
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
function updateNews(city, newsType) {
    var xmlhttp = new XMLHttpRequest();
    var nameValuePairs = 'city='+city+'&newsType='+newsType;
    xmlhttp.open("POST", "api/getNews", false); //AJAX Set request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(nameValuePairs);

    var response = JSON.parse(xmlhttp.responseText);
    var news = document.getElementById('news');
    document.getElementById('newsDiv').style.visibility="visible";
    var toSet = '<div class="ui massive red label">Local News</div> <br/><br/>';
    for(var i = 0; i < response['message']['d']['results'].length; i++) {
        var item = response['message']['d']['results'][i];
        toSet+='<div class="item"> <i class="newspaper icon"></i> <div class="content"> <a class="header" href="'+item['Url']+'">'+item['Title']+'</a> <div class="description">'+item['Description'].replace(/^(.{100}[^\s]*).*/, "$1")+'...</div> </div> </div>';
    }

    toSet+='</div>';
    news.innerHTML = toSet;
}

function updateFood(city) {
    var xml = new XMLHttpRequest();
    var nameValuePairs = 'city='+city;
    xml.open("POST", "api/getFood", false); //AJAX Set request
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(nameValuePairs);

    var response = JSON.parse(xml.responseText);
    var food = document.getElementById('food');
    document.getElementById('foodDiv').style.visibility="visible";
    var toSet = '<div class="ui massive red label">Local Dining</div> <br/><br/>';
    for(var i = 0; i < response['message']['businesses'].length; i++) {
        var item = response['message']['businesses'][i];
        toSet+='<div class="item"> <i class="food icon"></i> <div class="content"> <a class="header" href="'+item['url']+'">'+item['name']+'</a> <div class="list">';
        for(var j = 0; j < item['categories'].length; j++) {
            toSet+='<div class="item"> <i class="right triangle icon"></i>   <div class="content"> <div class="description">'+item['categories'][j][0]+'</div> </div> </div>';
        }
        toSet+='<div class="item"> <i class="star icon"></i> <div class="content" style="color: red">'+item['rating']+' Star Rating! </div> </div> </div> </div> </div>';
    }

    toSet+='</div>';
    food.innerHTML = toSet;
}

function updateEvents(city, typeOfEvent) {
    var xml = new XMLHttpRequest();
    var nameValuePairs = 'city='+city+'&typeOfEvent='+typeOfEvent;
    xml.open("POST", "api/getEvents", false); //AJAX Set request
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(nameValuePairs);

    var response = JSON.parse(xml.responseText);
    return response;
}

//janky fix
function updateInformation(city) {
    updateNews(city, 'rt_US');
    updateFood(city);
}