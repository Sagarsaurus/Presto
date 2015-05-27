/**
 * Created by sagarsaurus on 5/26/15.
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handle_errors);
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

function handle_errors(error)
{
    switch(error.code)
    {
        case error.PERMISSION_DENIED: alert("user did not share geolocation data");
            break;

        case error.POSITION_UNAVAILABLE: alert("could not detect current position");
            break;

        case error.TIMEOUT: alert("retrieving position timed out");
            break;

        default: alert("unknown error");
            break;
    }
}


