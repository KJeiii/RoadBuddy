let//
socket = io(),
latitudeRange = [24.988, 24.982], //0.006
longitudeRange = [121.534, 121.542]; //0.006



// test user's position by select position from randomPosition
let randomCoords = {
    latitude: 24.982 + Math.random()*0.006,
    longitude: 121.534 + Math.random()*0.006
};


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
        roomID : sessionStorage.getItem("roomID"),
        coord : {
            latitude: randomCoords.latitude,
            longitude: randomCoords.longitude
        }
    });



// ----- receive partners initial postion and show on the map -----
socket.on("initPosition", (user_info) => {

    for ( sid in user_info ) {
        console.log(socket.id);
        if ( sid !== socket.id && !idArray.includes(sid)) {
            let markerToAdd = L.marker([user_info[sid]["coords"][0].latitude, user_info[sid]["coords"][0].longitude]).addTo(map);
            idArray.push(sid);
            markerArray.push(markerToAdd);
        }
    }
});



// ----- update parners postion when moving -----
socket.on("movingPostion", (user_info) => {
    console.log(`idArray : ${idArray}`);
    console.log(`Update: ${user_info}`);

    for (id of idArray) {
        let//
        oldLatLng = [user_info[id]["coords"][0].latitude, user_info[id]["coords"][0].longitude],
        newLatLng = [user_info[id]["coords"][1].latitude, user_info[id]["coords"][1].longitude],
        movingMarker = markerArray[idArray.indexOf(id)];

        movingMarker.setLatLng(oldLatLng, newLatLng);
    }

});


// remove marker when user disconnects
// Case-1. close brwoser directly
socket.on("disconnect", (userID) => {
    map.removeLayer(markerArray[idArray.indexOf(userID)]);
    markerArray.splice(idArray.indexOf(userID),1);
    idArray.splice(idArray.indexOf(userID),1);
    console.log(`remaining userID after disconnect ${idArray}`)
});

// Case-2. press "leave" button
let leaveBtn = document.querySelector(".leave");
leaveBtn.addEventListener("click", () => {
    window.location.replace("/");
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

    let data = {
        roomID: sessionStorage.getItem("roomID"),
        coord: {
            latitude: randomCoords.latitude,
            longitude: randomCoords.longitude            
        }
    };
    console.log(`new data sent from client ${socket.id} : ${data}`);

    socket.emit("position", data);
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





