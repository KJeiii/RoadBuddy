
// create callback funciton for drawing initial position on the map
export function DrawMap(position){
    initialCoord = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    map = L.map('map').setView([initialCoord.latitude, initialCoord.longitude], 15);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

    // marker = L.marker([initialCoord.latitude, initialCoord.longitude], {title: `${window.sessionStorage.getItem("username")}`}).addTo(map);
    // marker._icon.classList.add("my-marker");

    let markerOption = {
        color: ownColor,
        fillOpacity: 0.7
    };
    marker = L.circleMarker([initialCoord.latitude, initialCoord.longitude], markerOption).addTo(map);

    // remove all markers in markerArray to initialize
    if (markerArray.length > 0) {
        for ( let i = 0; i < markerArray.length; i++) {
            markerArray.pop();
        }
    }
    markerArray.push(marker);
};

export function UserCoordError(error) {console.log(`Error in drawing initial map: ${error}`)};