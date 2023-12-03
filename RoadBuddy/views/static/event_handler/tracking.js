
// test user's position by select position from randomPosition
let randomCoords = {
    latitude: 24.982 + Math.random()*0.006,
    longitude: 121.534 + Math.random()*0.006
};


socket.on("connect", () => {
    idArray.push(socket.id);
    markerArray.push(marker);
});


// ----- send user initial postion to socket -----
socket.emit(
    "position", 
    {
        team_id : sessionStorage.getItem("team_id"),
        coord : {
            latitude: initialCoord[0],
            longitude: initialCoord[1]
        }
    });


// ----- receive partners initial postion and show on the map -----
socket.on("initPosition", (user_info) => {

    for ( sid in user_info ) {
        if ( sid !== socket.id && !idArray.includes(sid)) {
            let markerToAdd = L.marker([user_info[sid]["coords"][0].latitude, user_info[sid]["coords"][0].longitude]).addTo(map);
            idArray.push(sid);
            markerArray.push(markerToAdd);
        }
    }
});


// ----- update parners postion when moving -----
socket.on("movingPostion", (user_info) => {
    console.log(`Update: ${user_info}`);
    
    for (id of idArray) {
        try {
        let//
        oldLatLng = [user_info[id]["coords"][0].latitude, user_info[id]["coords"][0].longitude],
        newLatLng = [user_info[id]["coords"][1].latitude, user_info[id]["coords"][1].longitude],
        movingMarker = markerArray[idArray.indexOf(id)];

        movingMarker.setLatLng(oldLatLng, newLatLng);
        }
        catch(error) {console.log(`Error from user (${user_info[id]["username"]} : ${error})`)};
    }

});


// remove marker when user disconnects
// Case-1. close brwoser directly
socket.on("disconnect", (userID) => {
    map.removeLayer(markerArray[idArray.indexOf(userID)]);
    markerArray.splice(idArray.indexOf(userID),1);
    idArray.splice(idArray.indexOf(userID),1);
});

// Case-2. press "leave" button
let leaveBtn = document.querySelector(".leave");
leaveBtn.addEventListener("click", () => {
    window.location.replace("/room");
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

