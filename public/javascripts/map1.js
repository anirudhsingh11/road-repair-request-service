var map;

function initMap() {
    requestloc = {lat: lat, lng: lng}
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: requestloc,
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

    addInitialMarker(requestloc);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Cannot find your current location' :
        'Sorry your browser do not support Geolocation');
    infoWindow.open(map);
}

function addInitialMarker(location) {
    marker = new google.maps.Marker({
        position: location,
        map: map
    });
}