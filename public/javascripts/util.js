/**
 * Created by sagarsaurus on 5/26/15.
 */
var searchOptions = ['accounting', 'airport', 'amusement_park', 'aquarium', 'art_gallery', 'atm', 'bakery','bank', 'bar', 'beauty_salon', 'bicycle_store', 'book_store', 'bowling_alley', 'bus_station', 'cafe', 'campground', 'car_dealer', 'car_rental', 'car_repair', 'car_wash', 'casino', 'cemetary', 'church', 'city_hall', 'clothing_store', 'convenience_store', 'courthouse', 'dentist', 'department_store', 'doctor', 'electrician', 'electronics_store', 'embassy', 'establishment', 'finance', 'fire_station', 'florist', 'food', 'funeral_home', 'furniture_store', 'gas_station', 'general_contractor', 'grocery_or_supermarket', 'gym', 'hair_care', 'hardware_store', 'health', 'hindu_temple', 'home_goods_store', 'hospital', 'insurance_agency', 'jewelry_store', 'laundry', 'lawyer', 'library', 'liquor_store', 'local_government_office', 'locksmith', 'lodging', 'meal_delivery', 'meal_takeaway', 'mosque', 'movie_rental', 'movie_theater', 'moving_company', 'museum', 'night_club', 'painter', 'park', 'parking', 'pet_store', 'pharmacy', 'physiotherapist', 'place_of_worship', 'plumber', 'police', 'post_office', 'real_estate_agency', 'restaurant', 'roofing_contractor', 'rv_park', 'school', 'shoe_store', 'shopping_mall', 'spa', 'stadium', 'storage', 'store', 'subway_station', 'synagogue', 'taxi_stand', 'train_station', 'travel_agency', 'university', 'veterinary_care', 'zoo'];
var latitude = "";
var longitude = "";
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
    this.latitude = latitude;
    this.longitude = longitude;
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

//enter radius in miles, i'll handle the rest
function updateLocalLocations(rad, options) {
    var center = new google.maps.LatLng(parseFloat(this.latitude), parseFloat(this.longitude));
    var map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 15
    });
    console.log(center);
    var request = {
        location: center,
        radius: rad*1609+'',
        types: options,
        rankBy: google.maps.places.RankBy.PROMINENCE
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        //for (var i = 0; i < results.length; i++) {
        //    var place = results[i];
        //    createMarker(results[i]);
        //}
        return results;
    }

    else {
        console.log(status);
    }
}

//janky fix
function updateInformation(city) {
    updateNews(city, 'rt_US');
    updateFood(city);
}