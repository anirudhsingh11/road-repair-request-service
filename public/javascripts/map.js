var map, marker, latlng, infoWindow;
var latitude = document.getElementById("lat");
var longitude = document.getElementById("lng");

function initMap() {
    var indore = { lat: 22.7196, lng: 75.8577 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: indore,
        mapTypeId: 'terrain'
    });

    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Your Location');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    // This event listener will call addMarker() when the map is clicked.
    map.addListener('click', function (event) {
        addMarker(event.latLng);
    });

    addInitialMarker(indore);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Cannot find your current location' :
        'Sorry your browser do not support Geolocation');
    infoWindow.open(map);
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
    marker.setMap(null);
    marker = new google.maps.Marker({
        position: location,
        map: map
    });
    latlng = marker.getPosition();
    latlng = { lat: latlng.lat(), lng: latlng.lng() };
    latitude.value = latlng.lat;
    longitude.value = latlng.lng;
    console.log(latlng);
}

function addInitialMarker(location) {
    marker = new google.maps.Marker({
        position: location,
        map: map
    });
    marker.setMap(null);
}