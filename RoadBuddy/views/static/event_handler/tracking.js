
// test user's position by select position from randomPosition
let randomCoords = {
    latitude: 24.982 + Math.random()*0.006,
    longitude: 121.534 + Math.random()*0.006
};



// ----- receive partners initial postion and show on the map -----
socket.on("initPosition", (partners) => {
    let sid = socket.id;
    console.log(sid);
    console.log(typeof(Object.keys(partners)[0]));
    console.log(sid === Object.keys(partners)[0]);
    console.log(partners);
    console.log(partners[Object.keys(partners)[0]]);
    console.log(partners[sid]);


    for ( sid in partners ) {
        if ( sid !== socket.id && !sidArray.includes(sid)) {
            let markerToAdd = L.marker([partners[sid][0].latitude, partners[sid][0].longitude]).addTo(map);
            sidArray.push(sid);
            markerArray.push(markerToAdd);
            console.log(`${sid} coords is ${partners[sid][0].latitude}, ${partners[sid][0].longitude}`)
        }
    }
});


// ----- update partners postion when moving -----
socket.on("movingPostion", (partners) => {    
    for (sid of sidArray) {
        try {
        let//
        oldLatLng = [partners[sid][0].latitude, partners[sid][0].longitude],
        newLatLng = [partners[sid][1].latitude, partners[sid][1].longitude],
        movingMarker = markerArray[sidArray.indexOf(sid)];

        movingMarker.setLatLng(oldLatLng, newLatLng);
        }
        catch(error) {console.log(`Error from user (${partners[sid]["username"]} : ${error})`)};
    }

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
        sid : sessionStorage.getItem("sid"),
        user_id : sessionStorage.getItem("user_id"),
        username : sessionStorage.getItem("username"),
        email : sessionStorage.getItem("email"),
        team_id : sessionStorage.getItem("team_id"),
        coord : {
            latitude: randomCoords.latitude,
            longitude: randomCoords.longitude    
        }
    };
    socket.emit("position", data);
    console.log(`new data sent from client ${socket.id} : ${data}`);

}, 2000)


// var turnOnTracking = false;
// while (turnOnTracking) {
//     setInterval(()=> {
//         let randomCoords = {
//             latitude: 24.982 + Math.random()*0.006,
//             longitude: 121.534 + Math.random()*0.006
//         };

//         let data = {
//             sid : sessionStorage.getItem("sid"),
//             user_id : sessionStorage.getItem("user_id"),
//             username : sessionStorage.getItem("username"),
//             email : sessionStorage.getItem("email"),
//             team_id : sessionStorage.getItem("team_id"),
//             coord : {
//                 latitude: randomCoords.latitude,
//                 longitude: randomCoords.longitude    
//             }
//         };
//         socket.emit("position", data);
//         console.log(`new data sent from client ${socket.id} : ${data}`);

//     }, 2000)
// }