/**
 * Created by sagarsaurus on 5/26/15.
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }   else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    //console.log(latitude);
    //console.log(longitude);
    alert("Latitude is: "+latitude+"\nand Longitude is: "+longitude);
}


