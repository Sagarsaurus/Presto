/**
 * Created by sagarsaurus on 5/26/15.
 */
var searchOptions = ['accounting', 'airport', 'amusement_park', 'aquarium', 'art_gallery', 'atm', 'bakery','bank', 'bar', 'beauty_salon', 'bicycle_store', 'book_store', 'bowling_alley', 'bus_station', 'cafe', 'campground', 'car_dealer', 'car_rental', 'car_repair', 'car_wash', 'casino', 'cemetary', 'church', 'city_hall', 'clothing_store', 'convenience_store', 'courthouse', 'dentist', 'department_store', 'doctor', 'electrician', 'electronics_store', 'embassy', 'establishment', 'finance', 'fire_station', 'florist', 'food', 'funeral_home', 'furniture_store', 'gas_station', 'general_contractor', 'grocery_or_supermarket', 'gym', 'hair_care', 'hardware_store', 'health', 'hindu_temple', 'home_goods_store', 'hospital', 'insurance_agency', 'jewelry_store', 'laundry', 'lawyer', 'library', 'liquor_store', 'local_government_office', 'locksmith', 'lodging', 'meal_delivery', 'meal_takeaway', 'mosque', 'movie_rental', 'movie_theater', 'moving_company', 'museum', 'night_club', 'painter', 'park', 'parking', 'pet_store', 'pharmacy', 'physiotherapist', 'place_of_worship', 'plumber', 'police', 'post_office', 'real_estate_agency', 'restaurant', 'roofing_contractor', 'rv_park', 'school', 'shoe_store', 'shopping_mall', 'spa', 'stadium', 'storage', 'store', 'subway_station', 'synagogue', 'taxi_stand', 'train_station', 'travel_agency', 'university', 'veterinary_care', 'zoo'];
var latitude="";
var longitude="";
var city="";
var state="";
var country="";
var geocoder;
function getLocation() {

    if (navigator.geolocation) {
        geocoder = geocoder = new google.maps.Geocoder();
        navigator.geolocation.getCurrentPosition(showPosition, handle_errors);
    }   else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    var latlng = new google.maps.LatLng(parseFloat(this.latitude), parseFloat(this.longitude));
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                //formatted address
                this.city=results[0].address_components[2].long_name;
                this.state=results[0].address_components[5].long_name;
                this.country=results[0].address_components[6].long_name;
            } else {
                alert("No results found");
            }
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });
    // console.log(latitude);
    // console.log(longitude);
    // alert("Latitude is: "+latitude+"\nand Longitude is: "+longitude);;
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
var newsStuff = "";
var listView;
//update this to take in news type in the future, remove call in showPosition once sunny finishes dropdown
function updateNews(city, newsType) {
    var xmlhttp = new XMLHttpRequest();
    var nameValuePairs = 'city='+city+'&newsType='+newsType;
    xmlhttp.open("POST", "api/getNews", false); //AJAX Set request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(nameValuePairs);

    var response = JSON.parse(xmlhttp.responseText);
    document.getElementById('infoDiv').style.visibility="visible";
    var toSet = "<div class='container'>";
    toSet += '<div class="ui large green label" id="messageHeader">Local News <span><i class="newspaper icon"></i></span></div> ';
    toSet += "<br/><br/>";
    var responseList = response['message']['d']['results'];
    //var tempString = <div class="description">'+item['Description'].replace(/^(.{100}[^\s]*).*/, "$1")+'...</div>
    var $el = $('#newsContentLocation');
    listView = new infinity.ListView($el);
    var item;
    var itemLists = [];

    for(var i = 0; i < responseList.length; i++) {
        item = response['message']['d']['results'][i];

        // DO NOT DELETE THE COMMENTS BELOW. They may be useful later!
        toSet+='<div class="item"> ' +
            '<div class="content"> ' +
                //'<div class="ui grid">'+
                //    "<div class='column'>"+
            '<a class="header" href="'+item['Url']+'">'+item['Title']+'</a> ' +
                //    "</div>"+
                //    "<div class='column'>"+
                //        "<span></span>"+
                //    "</div>"+
                //"</div>"+
            '</div> ' +
            '</div><hr>';
        //var $element =$('<div class="item"> ' +
        //    '<div class="content"> ' +
        //        //'<div class="ui grid">'+
        //        //    "<div class='column'>"+
        //    '<a class="header" href="'+item['Url']+'">'+item['Title']+'</a> ' +
        //        //    "</div>"+
        //        //    "<div class='column'>"+
        //        //        "<span></span>"+
        //        //    "</div>"+
        //        //"</div>"+
        //    '</div> ' +
        //    '</div><hr>');
        //var itemElement ='<div class="item"> ' +
        //    '<div class="content"> ' +
        //        //'<div class="ui grid">'+
        //        //    "<div class='column'>"+
        //    '<a class="header" href="'+item['Url']+'">'+item['Title']+'</a> ' +
        //        //    "</div>"+
        //        //    "<div class='column'>"+
        //        //        "<span></span>"+
        //        //    "</div>"+
        //        //"</div>"+
        //    '</div> ' +
        //    '</div><hr>';
        //itemLists.push(itemElement);
        //listView.append($element);
    }
    toSet+='</div>';
    //console.log(listView);
    newsStuff = toSet;
}

var foodHtml;
function updateFood(city) {
    var xml = new XMLHttpRequest();
    var nameValuePairs = 'city='+city;
    xml.open("POST", "api/getFood", false); //AJAX Set request
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(nameValuePairs);

    var response = JSON.parse(xml.responseText);
    var food = document.getElementById('food');
    document.getElementById('infoDiv').style.visibility="visible";
    var toSet = "<div class='container'>";
    toSet += '<div class="ui large red label" id="messageHeader">Local Dining <span><i class="food icon"></i></span></div> ';
    toSet += "<br/><br/>";
    var responseList = response['message']['businesses'];
    for(var i = 0; i < responseList.length; i++) {
        var item = responseList[i];
        toSet+='<div class="item"> ' +
            '<div class="content"> <div class="ui grid" style="width:100%; text-align: center;"> <div class="column" style="font-size: large; width: 50%;">' +
                //'<div class="ui grid">'+
                //    "<div class='column'>"+
            '<a class="header" href="'+item['url']+'">'+item['name']+'</a> ' +
                //    "</div>"+
                //    "<div class='column'>"+
                //        "<span></span>"+
                //    "</div>"+
                //"</div>"+
            '</div> ';
        //for(var j = 0; j < item['categories'].length; j++) {
        //    toSet+='<div class="item"> <i class="right triangle icon"></i>   <div class="content"> <div class="description">'+item['categories'][j][0]+'</div> </div> </div>';
        //}
        toSet+='<div class="column" style="font-style: italic; font-size: large; width: 50%;"><div class="content">';
        var parsedInt = parseInt(item['rating']);
        //console.log(parsedInt);
        for(var x = 0; x < parsedInt; x++) {
            toSet+= '<i class="star icon" style="color: red"></i>';
        }
        for(var y = 0; y < 5-parsedInt; y++) {
            toSet += '<i class="star icon" style="color:black"></i>';
        }
        toSet += '</div></div></div></div></div><hr>';
    }

    toSet+='</div>';
    foodHtml = toSet;
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

//function which gathers information about several different local elements, look at list at top to see potential options
//pass in options as a list: for example, ['food', 'church'], etc
//enter radius in miles, i'll handle the rest
function updateLocalLocations(rad, options) {
    var center = new google.maps.LatLng(parseFloat(this.latitude), parseFloat(this.longitude));
    var map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 15
    });
    var request = {
        location: center,
        radius: rad*1609+'',
        types: options,
        rankBy: google.maps.places.RankBy.PROMINENCE
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, success);
}

//this is good for now, can adjust for latitude and longitude queries later as api handles them
function getWeather(city, numberOfDays) {
    var xml = new XMLHttpRequest();
    var apiString = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+city+'&cnt='+numberOfDays+'&mode=json&units=imperial&APPID=18bfea6c2bf42a53f86122f302260512';
    xml.open("GET", apiString, false); //AJAX Set request
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send();
    var response = JSON.parse(xml.responseText);
    return response;
}

//janky fix
function updateInformation(city) {
    updateNews(city, 'rt_US');
    updateFood(city);
}

function updateBasedOnLocation() {
    updateNews(this.city, 'rt_US');
    updateFood(this.city);
}

