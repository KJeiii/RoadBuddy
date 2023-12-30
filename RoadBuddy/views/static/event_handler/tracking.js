
// test user's position by select position from randomPosition
let randomCoords = {
    latitude: 24.982 + Math.random()*0.006,
    longitude: 121.534 + Math.random()*0.006
};



// ----- receive partners initial postion and show on the map -----
socket.on("initPosition", (partners) => {
    let colorReference = (team_sender_info_cache === undefined) ? partnersColor : team_sender_info_cache.partners_color;
    if (Object.keys(partners).length >= 2) {

        // Create new collection of markers
        // If partner get in team at the first time
        let oldMarker = document.querySelector(".leaflet-interactive");
        if (oldMarker.getAttribute("fill") !== colorReference[sidReference[socket.id]]["color"]) {
            // 1. delete original marker
            for ( let i = 0; i < markerArray.length; i++) {
                map.removeLayer(markerArray[i]);
                markerArray.pop();
            }
            
            // 2. create a new marker with specified color refering to colorReference
            let//
            id = sidReference[socket.id],
            markerOption = {
                color: colorReference[id].color,
                fillOpacity: 0.7
            },
            markerToAdd = L.circleMarker([partners[socket.id][0].latitude, partners[socket.id][0].longitude], markerOption).addTo(map);
            markerArray.push(markerToAdd);
        }


        // Create other partners marker
        for ( sid in partners ) {
            let id = sidReference[sid];
            if ( sid !== socket.id && !sidArray.includes(sid)) {
                // 1. add circleMarker
                let markerOption = {
                    color: colorReference[id].color,
                    fillOpacity: 0.7
                };
                let markerToAdd = L.circleMarker([partners[sid][0].latitude, partners[sid][0].longitude], markerOption).addTo(map);
    
                // 2. register new partner information (sid, circleMaker object)
                sidArray.push(sid);
                markerArray.push(markerToAdd);
                console.log("new marker created!");
            }
        }
        return
    }

    // -> When user logins, room.js create it's own marker; no need to create again
    // stay on room page, not joining team
    // let ownCoords = partners[socket.id];
    //     // add circleMarker
    //     let markerOption = {
    //         color: colorReference[id].color,
    //         fillOpacity: 0.7
    //     };
    //     let markerToAdd = L.circleMarker(ownCoords[0].latitude, ownCoords[0].longitude, markerOption).addTo(map);
    //     // register new partner information (sid, circleMaker object)
    //     sidArray.push(sid);
    //     markerArray.push(markerToAdd);
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
        catch(error) {error};
    }

});



// ----- receive msg and show on the view -----
socket.on("message", (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});


// ----- tracking user device position changing-----
let coordFromBrowser = {};
let watchCoord = window.navigator.geolocation.watchPosition(
    (position) => {
        coordFromBrowser = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
    }
);

// setInterval(() => {
//     let data = {
//         sid : sessionStorage.getItem("sid"),
//         user_id : sessionStorage.getItem("user_id"),
//         username : sessionStorage.getItem("username"),
//         email : sessionStorage.getItem("email"),
//         team_id : sessionStorage.getItem("team_id"),
//         coord : {
//             latitude: coordFromBrowser.latitude,
//             longitude: coordFromBrowser.longitude    
//         }
//     };
    
//     socket.emit("position", data);

// }, 500);



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
}, 2000)