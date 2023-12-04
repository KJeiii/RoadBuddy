
// test user's position by select position from randomPosition
let randomCoords = {
    latitude: 24.982 + Math.random()*0.006,
    longitude: 121.534 + Math.random()*0.006
};



// ----- listener for receiving "join_team" event from server ----- 
// ----- and send user initial position to socket -----
socket.on("enter_team", () => {
    let data = {
        sid : sessionStorage.getItem("sid"),
        user_id : sessionStorage.getItem("user_id"),
        username : sessionStorage.getItem("username"),
        email : sessionStorage.getItem("email"),
        team_id : sessionStorage.getItem("team_id"),
        coord : {
            latitude: initialCoord[0],
            longitude: initialCoord[1]
        }
    };

    socket.emit("position", data);
})



// ----- receive partners initial postion and show on the map -----
socket.on("initPosition", (partners) => {
    for ( sid in partners ) {
        if ( sid !== socket.id && !sidArray.includes(sid)) {
            let markerToAdd = L.marker([partners[sid][0].latitude, partners[sid][0].longitude]).addTo(map);
            sidArray.push(sid);
            markerArray.push(markerToAdd);
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
        roomID: sessionStorage.getItem("roomID"),
        coord: {
            latitude: randomCoords.latitude,
            longitude: randomCoords.longitude            
        }
    };
    console.log(`new data sent from client ${socket.id} : ${data}`);

    socket.emit("position", data);
}, 2000)

