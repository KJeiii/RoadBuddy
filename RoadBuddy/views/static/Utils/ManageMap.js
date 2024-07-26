export function AppendMarkerOnMap(mapElement, coordination, imageUrl){ //coordination = {latitude: XXX, longitude: XXX}
    const myIcon = L.icon({
        iconUrl: imageUrl,
        iconSize: [40, 40],
        className: "icon-on-map"
    });
    const newMarker = L.marker([coordination.latitude, coordination.longitude], 
                        {icon: myIcon}).addTo(mapElement);
    return newMarker
}


// create callback funciton for drawing initial position on the map
export function DrawMap(position){
    const initialCoord = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    map = L.map('map').setView([initialCoord.latitude, initialCoord.longitude], 15);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    
    const myMarker = AppendMarkerOnMap(map, initialCoord, window.sessionStorage.getItem("image_url"))
    // remove all markers in markerArray to initialize
    if (markerArray.length > 0) {
        for ( let i = 0; i < markerArray.length; i++) {
            markerArray.pop();
        }
    }
    markerArray.push(myMarker);
    
    // let markerOption = {
        //     color: ownColor,
        //     fillOpacity: 0.7
        // };
    // marker = L.marker([initialCoord.latitude, initialCoord.longitude], {icon: myIcon}).addTo(map);
    // 如果是要用其他marker，{icon:myIcon}這組變數要改
};

export function UserCoordError(error) {console.log(`Error in drawing initial map: ${error}`)};