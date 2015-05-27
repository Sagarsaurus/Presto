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


