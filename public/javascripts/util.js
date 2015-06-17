/**
 * Created by sagarsaurus on 5/26/15.
 */
var searchOptions = ['accounting', 'airport', 'amusement_park', 'aquarium', 'art_gallery', 'atm', 'bakery','bank', 'bar', 'beauty_salon', 'bicycle_store', 'book_store', 'bowling_alley', 'bus_station', 'cafe', 'campground', 'car_dealer', 'car_rental', 'car_repair', 'car_wash', 'casino', 'cemetary', 'church', 'city_hall', 'clothing_store', 'convenience_store', 'courthouse', 'dentist', 'department_store', 'doctor', 'electrician', 'electronics_store', 'embassy', 'establishment', 'finance', 'fire_station', 'florist', 'food', 'funeral_home', 'furniture_store', 'gas_station', 'general_contractor', 'grocery_or_supermarket', 'gym', 'hair_care', 'hardware_store', 'health', 'hindu_temple', 'home_goods_store', 'hospital', 'insurance_agency', 'jewelry_store', 'laundry', 'lawyer', 'library', 'liquor_store', 'local_government_office', 'locksmith', 'lodging', 'meal_delivery', 'meal_takeaway', 'mosque', 'movie_rental', 'movie_theater', 'moving_company', 'museum', 'night_club', 'painter', 'park', 'parking', 'pet_store', 'pharmacy', 'physiotherapist', 'place_of_worship', 'plumber', 'police', 'post_office', 'real_estate_agency', 'restaurant', 'roofing_contractor', 'rv_park', 'school', 'shoe_store', 'shopping_mall', 'spa', 'stadium', 'storage', 'store', 'subway_station', 'synagogue', 'taxi_stand', 'train_station', 'travel_agency', 'university', 'veterinary_care', 'zoo'];
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
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var latlng = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                //formatted address
                var city=results[0].address_components[2].long_name;
                var state=results[0].address_components[5].long_name;
                var country=results[0].address_components[6].long_name;
                updateBasedOnLocation(city, latitude, longitude);
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

        case error.POSITION_UNAVAILABLE: alert("We could not gather your location.  Please make sure location services are enabled in your browser.");
            break;

        case error.TIMEOUT: alert("Timed out trying to detect current position.");
            break;

        default: alert("Unknown Error");
            break;
    }
}
var listView;
//update this to take in news type in the future, remove call in showPosition once sunny finishes dropdown
function updateNews(city, newsType) {
        document.getElementById('news').innerHTML = '<div class="ui active inline loader"></div> <br/><h2>Loading News</h2>';
        if(document.getElementById('news-collapse') != null) {
            document.getElementById('news-collapse').innerHTML = '<div class="ui active inline loader"></div> <br/><h2>Loading News</h2>';
        }
    var xml = new XMLHttpRequest();
    var nameValuePairs = 'city='+city+'&newsType='+newsType;
    var response;
    xml.onreadystatechange=function() {
        if (xml.readyState==4 && xml.status==200) {
            response = JSON.parse(xml.responseText);
            var toSet = "<div class='container'>";
            var responseList = response['message']['d']['results'];
            //var tempString = <div class="description">'+item['Description'].replace(/^(.{100}[^\s]*).*/, "$1")+'...</div>
            var $el = $('#news');
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
            document.getElementById('news').innerHTML = toSet;
            if(document.getElementById('news-collapse') != null) {
                document.getElementById('news-collapse').innerHTML = toSet;
            }
        }
    };

    xml.open("POST", "api/getNews", true); //AJAX Set request
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(nameValuePairs);
}

//add support soon to allow them to order results by either distance or highest rating.  Filtering by cuisine should be done on the front end itself.
function updateFood(city, lat, long) {
    document.getElementById('food').innerHTML = '<div class="ui active inline loader"></div><br/><h2>Loading Food Offerings</h2>';
    if(document.getElementById('news-collapse') != null) {
        document.getElementById('food-collapse').innerHTML = '<div class="ui active inline loader"></div><br/><h2>Loading Food Offerings</h2>';
    }
    var nameValuePairs = "";
    if(lat != null && long != null) {
        nameValuePairs = 'city='+city+'&coordinates='+lat+','+long;
    }
    else {
        nameValuePairs = 'city='+city;
    }

    var xml = new XMLHttpRequest();
    var response;
    xml.onreadystatechange=function() {
        if (xml.readyState==4 && xml.status==200) {
            response = JSON.parse(xml.responseText);

            var food = document.getElementById('food');
            var toSet = "<div class='container'>";
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
                    toSet+= '<span class="glyphicon glyphicon-star" style="color: red"></span>';
                }
                for(var y = 0; y < 5-parsedInt; y++) {
                    toSet += '<span class="glyphicon glyphicon-star-empty" style="color: black"></span>';
                }
                toSet += '</div></div></div></div></div><hr>';
            }

            toSet+='</div>';
            document.getElementById('food').innerHTML = toSet;
            if(document.getElementById('food-collapse') != null) {
                document.getElementById('food-collapse').innerHTML = toSet;
            }
        }
    };

    xml.open("POST", "api/getFood", true); //AJAX Set request
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(nameValuePairs);
}

function updateEvents(city, lat, long, radius) {
    document.getElementById('events').innerHTML = '<div class="ui active inline loader"></div> <br/><h2>Loading Event Offerings</h2>';
    if(document.getElementById('events-collapse') != null) {
        document.getElementById('events-collapse').innerHTML = '<div class="ui active inline loader"></div> <br/><h2>Loading Event Offerings</h2>';
    }
    var xml = new XMLHttpRequest();
    var apiString = 'https://www.eventbriteapi.com/v3/events/search/?';
    if(lat != null && long != null && radius != null) {
        apiString += 'location.latitude='+lat+'&location.longitude='+long+'&location.within='+radius+'mi&sort_by=date';
    }
    else {
        apiString += 'venue.city='+city+'&sort_by=date';
    }
    apiString+='&token=JJQXYFFDBPDNMWYPV6TZ';
    var response;
    xml.onreadystatechange=function() {
        if (xml.readyState==4 && xml.status==200) {
            response = JSON.parse(xml.responseText);
            //uncomment this next line to see the contents of the JSON to add future functionality.
            //console.log(response);
            var restructure = [];
            var index = 0;
            var indexArray = [];
            //the following code restructures the data so that we remove duplicate items on the event list.
            //now we simply need to iterate through the restructured array, indexing using the string from the indexArray to get a list of elements with the same names
            //finally, we just have to list all future dates with some more iteration, but that hasn't been implemented yet.
            for(var i = 0; i < response['events'].length; i++) {
                item = response['events'][i];
                if(restructure[item['name'].text]==null) {
                    restructure[item['name'].text]=[];
                    indexArray[index] = item['name'].text;
                    index+=1;
                }

                restructure[item['name'].text].push(item);

            }

            var toSet = "<div class='container'>";

            //console.log(restructure);
            for(var j = 0; j < index; j++) {
                var item = restructure[indexArray[j]];

                // DO NOT DELETE THE COMMENTS BELOW. They may be useful later!
                toSet+='<div class="item"> ' +
                '<div class="content"> ' +
                    //'<div class="ui grid">'+
                    //    "<div class='column'>"+
                '<div class="ui massive blue label">'+item[0]['name'].text+'</div><br/><br/><div class="ui compact menu"><div class="ui simple dropdown item">Dates: <i class="dropdown icon"></i><div class="menu">';
                for(var k=0; k < item.length; k++) {
                    toSet+='<div class="item"><a href="'+item[k].url+'">'+item[k]["start"].local.slice(0, 10)+'</a></div>';

                }
                //    "</div>"+
                //    "<div class='column'>"+
                //        "<span></span>"+
                //    "</div>"+
                //"</div>"+
                toSet+='</div></div></div></div>' +
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
            document.getElementById('events').innerHTML = toSet;
            if(document.getElementById('events-collapse') != null) {
                document.getElementById('events-collapse').innerHTML = toSet;
            }
        }
    };
    xml.open("GET", apiString, true); //AJAX Set request
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send();
}

//function which gathers information about several different local elements, look at list at top to see potential options
//pass in options as a list: for example, ['food', 'church'], etc
//enter radius in miles, i'll handle the rest
function updateLocalLocations(lat, long, rad, options) {
    var center = new google.maps.LatLng(parseFloat(lat), parseFloat(long));
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
    var ret = service.nearbySearch(request, success);
}

function success(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        //THIS IS WHERE YOU SHOULD REPLACE THE HTML ON THE PAGE LIKE YOU DID FOR THE OTHER FUNCTIONS.
        //THIS IS ASYNCHRONOUS SO IT NEEDS TO BE HANDLED DIFFERENTLY.
        console.log(results);
    }
    else {
        console.log(status);
    }
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

function updateHousing(city, lat, long, radiusInMiles) {
    var xml = new XMLHttpRequest();
    document.getElementById('lodging').innerHTML = '<div class="ui active inline loader"></div> <br/><h2>Loading Lodging</h2>';
    if(document.getElementById('lodging-collapse') != null) {
        document.getElementById('lodging-collapse').innerHTML = '<div class="ui active inline loader"></div> <br/><h2>Loading Lodging</h2>';
    }
    //currently the distance is hardcoded but it must be changed in the future to whatever the user wants
    var apiString = 'https://zilyo.p.mashape.com/search?provider=airbnb%2Calwaysonvacation%2Capartmentsapart%2Cbedycasa%2Cbookingpal%2Ccitiesreference%2Cedomizil%2Cgeronimo%2Cgloveler%2Cholidayvelvet%2Chomeaway%2Chomestay%2Chostelworld%2Chousetrip%2Cinterhome%2Cnflats%2Croomorama%2Cstopsleepgo%2Ctheotherhome%2Ctravelmob%2Cvacationrentalpeople%2Cvaycayhero%2Cwaytostay%2Cwebchalet%2Czaranga' +
        '&latitude='+lat+'&longitude='+long+"&resultsperpage=50&sort=relevance&maxdistance="+parseFloat(radiusInMiles)/1.60;
    var response;
    xml.onreadystatechange=function() {
        if (xml.readyState==4 && xml.status==200) {
            response = JSON.parse(xml.responseText);
            var toSet = "<div class='container'>";
            toSet += '<div class="ui two column middle aligned relaxed fitted stackable grid" style="position: relative"><div class="center aligned column"><div class="ui massive blue label">Non-Traditional Lodging</div><br/><br/>';
            var responseList = response['result'];
            for(var i = 0; i < responseList.length; i++) {
                var item = responseList[i];
                toSet+='<div class="item"> ' +
                '<div class="content"> ' +
                    //'<div class="ui grid">'+
                    //    "<div class='column'>"+
                '<a class="header" href="'+item['provider'].url+'">'+item['provider'].full+' Listing: '+item['attr'].heading+'</a> '+
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

            toSet+='</div><div class="ui vertical divider">Or</div>';

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var response = JSON.parse(xmlhttp.responseText);
                    var responseList = response['message']['businesses'];
                    toSet+='<div class="center aligned column"><div class="ui massive blue label">Traditional Lodging</div><br/><br/>';
                    for(var j = 0; j < responseList.length; j++) {
                        var item = responseList[j];
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
                        '</div>';
                        //for(var j = 0; j < item['categories'].length; j++) {
                        //    toSet+='<div class="item"> <i class="right triangle icon"></i>   <div class="content"> <div class="description">'+item['categories'][j][0]+'</div> </div> </div>';
                        //}
                        toSet+='<div class="column" style="font-style: italic; font-size: large; width: 50%;"><div class="content">';
                        var parsedInt = parseInt(item['rating']);
                        //console.log(parsedInt);
                        for(var x = 0; x < parsedInt; x++) {
                            toSet+= '<span class="glyphicon glyphicon-star" style="color: red"></span>';
                        }
                        for(var y = 0; y < 5-parsedInt; y++) {
                            toSet += '<span class="glyphicon glyphicon-star-empty" style="color: black"></span>';
                        }
                        toSet += '</div></div></div></div></div><hr>';
                    }
                    toSet+='</div></div></div>';
                    //console.log(listView);
                    document.getElementById('lodging').innerHTML = toSet;
                    if(document.getElementById('lodging-collapse') != null) {
                        document.getElementById('lodging-collapse').innerHTML = toSet;
                    }
                }
            };
            xmlhttp.open("POST", 'api/getHotels', true); //AJAX Set request
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var nameValuePairs = "city="+city+'&coordinates='+lat+','+long;
            xmlhttp.send(nameValuePairs);
        }
    };
    xml.open("GET", apiString, true); //AJAX Set request
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.setRequestHeader("X-Mashape-Key", "HxCVmkeS4ymshwsxKwjHxbk7U3wap1SO9SqjsnuxNUD4DMYMv0");
    xml.send();
}

function addDeal(description, industry, affiliated_with, posted_by, latitude, longitude, valid_until, url) {
    var xml = new XMLHttpRequest();
    var nameValuePairs = 'latitude='+lat+'&longitude='+long+'&radius='+radiusInMiles;
    xml.onreadystatechange=function() {
        if (xml.readyState == 4 && xml.status == 200) {
            var response = JSON.parse(xml.responseText);
            //this is not complete yet.  We need to handle two cases: one where it succeeds and returns a success message
            //and the second where it returns an error.  This is what we need to handle, and this needs to be called
            //with appropriate values for the parameters from the user's side.
            console.log(response);
        }
    };
    xml.open("POST", 'api/addDeal', true); //AJAX Set request
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(nameValuePairs);
}

function updateDeals(lat, long, radiusInMiles) {
    document.getElementById('deals').innerHTML = '<div class="ui active inline loader"></div> <br/><h2>Loading Deals</h2>';
    if(document.getElementById('deals-collapse') != null) {
        document.getElementById('deals-collapse').innerHTML = '<div class="ui active inline loader"></div> <br/><h2>Loading Deals</h2>';
    }
    var xml = new XMLHttpRequest();
    var nameValuePairs = 'latitude='+lat+'&longitude='+long+'&radius='+radiusInMiles;
    xml.onreadystatechange=function() {
        if (xml.readyState == 4 && xml.status == 200) {
            var response = JSON.parse(xml.responseText);
            //console.log(response);
            var toSet = "<div class='container'>";
            var responseList = response['message'];
            for(var i = 0; i < responseList.length; i++) {
                var item = responseList[i];
                toSet+='<div class="item"> ' +
                '<div class="content"> ' +
                    //'<div class="ui grid">'+
                    //    "<div class='column'>"+
                '<a class="header" href="'+item.url+'">'+item.affiliated_with+': '+item.description+'</a> '+
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
            document.getElementById('deals').innerHTML = toSet;
            if(document.getElementById('deals-collapse') != null) {
                document.getElementById('deals-collapse').innerHTML = toSet;
            }
        }
    };
    xml.open("POST", 'api/getDeals', true); //AJAX Set request
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(nameValuePairs);
}


//janky fix
function updateInformation(city, state) {
    var xml = new XMLHttpRequest();
    var apiString = 'https://maps.googleapis.com/maps/api/geocode/json?address='+city+','+state+'&key=AIzaSyCoUofCZSTI0oBhfJGuwRp58TqgTnCiH64';
    document.getElementById('resultDiv').setAttribute("style", "visibility: visible");
    xml.onreadystatechange=function() {
        if (xml.readyState == 4 && xml.status == 200) {
            var response = JSON.parse(xml.responseText);
            var lat = response['results'][0]['geometry']['location'].lat;
            var long = response['results'][0]['geometry']['location'].lng;
            updateNews(city, 'rt_US');
            updateFood(city, lat, long);
            updateEvents(city, lat, long, null);
            updateHousing(city, lat, long, 15);
            updateDeals(lat, long, 5);
            //updateLocalLocations(lat, long, 10, ['lodging']);
        }
    };
    xml.open("GET", apiString, true); //AJAX Set request
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send();
}

function updateBasedOnLocation(city, lat, long) {
    document.getElementById('resultDiv').setAttribute("style", "visibility: visible");
    updateNews(city, 'rt_US');
    updateFood(city, lat, long);
    updateEvents(city, lat, long, 10);
    updateHousing(city, lat, long, 15);
    updateDeals(lat, long, 5);
    //updateLocalLocations(lat, long, 10, ['lodging']);
}