let//
socket = io(),
latitudeRange = [24.988, 24.982], //0.006
longitudeRange = [121.534, 121.542]; //0.006



// test user's position by select position from randomPosition
let randomCoords = {
    latitude: 24.982 + Math.random()*0.006,
    longitude: 121.534 + Math.random()*0.006
};
console.log(`from randomly picking up : (${randomCoords.latitude}, ${randomCoords.longitude})`);


// ----- show user initial view -----
let map = L.map('map').setView([randomCoords.latitude, randomCoords.longitude], 30);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
var//
marker = L.marker([randomCoords.latitude, randomCoords.longitude]).addTo(map),
idArray = [],
markerArray = [];



socket.on("connect", () => {
    idArray.push(socket.id);
    markerArray.push(marker);
});


// ----- send user initial postion to socket -----
socket.emit(
    "position", 
    {
        latitude: randomCoords.latitude,
        longitude: randomCoords.longitude
    });



// ----- receive partners initial postion and show on the map -----
socket.on("initPosition", (partner_info) => {

    for ( sid in partner_info ) {
        console.log(socket.id);
        if ( sid !== socket.id && !idArray.includes(sid)) {
            let markerToAdd = L.marker([partner_info[sid][0].latitude, partner_info[sid][0].longitude]).addTo(map);
            idArray.push(sid);
            markerArray.push(markerToAdd);
        }
    }

    console.log(`idArray: ${idArray}`);
    console.log(`markerArray: ${markerArray}`);
});



// ----- update parners postion when moving -----
socket.on("movingPostion", (partner_info) => {

    for ( id of idArray) {
        let//
        oldLatLng = [partner_info[id][0].latitude, partner_info[id][0].longitude],
        newLatLng = [partner_info[id][1].latitude, partner_info[id][1].longitude],
        movingMarker = markerArray[idArray.indexOf(id)];

        movingMarker.setLatLng(oldLatLng, newLatLng);
    }

    
    
    // console.log(`aim to move: (${newLatLng})`);

    // console.log(`marker before moving : ${marker.getLatLng()}`);
    // console.log(`marker after moving : ${marker.getLatLng()}`);
});


// remove marker when user disconnects
socket.on("disconnect", () => {
    map.removeLayer(marker);
});



// ----- receive msg and show on the view -----
socket.on("message", (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});



// ----- change postion randomly -----
setInterval(()=> {
    let randomCoords = {
        latitude: 24.982 + Math.random()*0.006,
        longitude: 121.534 + Math.random()*0.006
    };

    socket.emit(
        "position", 
        {
            latitude: randomCoords.latitude,
            longitude: randomCoords.longitude
        });
}, 2000)



    

// use browser BOM navigator object to get user's position
// if (navigator.geolocation) {
//     window.navigator.geolocation.getCurrentPosition((position)=> {
       
//         console.log(position);
//         socket.emit(
//             "position", 
//             {
//                 latitude: position.coords.latitude,
//                 longitude: position.coords.longitude
//             });
        
//         socket.on("position", (data) => {
//             console.log(data);
//             var map = L.map('map').setView([data.latitude, data.longitude], 30);
//             const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                     maxZoom: 19,
//                     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//                 }).addTo(map);
            
//             var marker = L.marker([data.latitude, data.longitude]).addTo(map);
//         })
//     }, 
//     (error) => {console.log(error)})
// }





