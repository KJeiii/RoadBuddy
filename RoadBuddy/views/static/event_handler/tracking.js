import { mapInfo } from "../main.js";

// ----- update partners postion when moving -----
socket.on("movingPostion", (partners) => {
    for (const partnerSID in partners){
        const parterIsOnMap = mapInfo.GetAllMarkersSID().includes(partnerSID);
        if (parterIsOnMap){
            mapInfo.UpdateMarkerPosition(partnerSID, partners[partnerSID]["coordination"]);
        }
    }
});

// ----- change postion randomly -----
setInterval(()=> {
    const//
        randomCoords = {latitude: 24.982 + Math.random()*0.006, longitude: 121.534 + Math.random()*0.006},
        dataToUpdatePosition = { ...window.sessionStorage, coordination: {...randomCoords}},
        notInTeam = window.sessionStorage.getItem("team_id") === "" 
                   || window.sessionStorage.getItem("team_id") === null;
    delete dataToUpdatePosition["friendList"];

    if (notInTeam){
        myCoord = {...myCoord, ...randomCoords}
        mapInfo.UpdateMarkerPosition(socket.id, myCoord);
        return
    }
    socket.emit("position", dataToUpdatePosition);
}, 1000)

// ----- tracking user device position changing-----
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

// ----- receive partners initial postion and show on the map -----
socket.on("initPosition", (partners) => {
    let colorReference = (team_sender_info_cache === undefined) ? partnersColor : team_sender_info_cache.partners_color;
    if (Object.keys(partners).length >= 2) {

        // Create new collection of markers
        // If partner get in team at the first time
        // let oldMarker = document.querySelector(".leaflet-interactive");
        // if (oldMarker.getAttribute("fill") !== colorReference[sidReference[socket.id]]["color"]) {
        //     // 1. delete original marker
        //     for ( let i = 0; i < markerArray.length; i++) {
        //         map.removeLayer(markerArray[i]);
        //         markerArray.pop();
        //     }
            
        //     // 2. create a new marker with specified color refering to colorReference
        //     let//
        //     id = sidReference[socket.id],
        //     markerOption = {
        //         color: colorReference[id].color,
        //         fillOpacity: 0.7
        //     },
        //     markerToAdd = L.circleMarker([partners[socket.id][0].latitude, partners[socket.id][0].longitude], markerOption).addTo(map);
        //     markerArray.push(markerToAdd);
        // }


        // Create other partners marker
        for ( let sid in partners ) {
            const//
                notMe = sid !== socket.id,
                notYetJoined = !sidArray.includes(sid),
                userID = sidReference[sid];

            // if ( sid !== socket.id && !sidArray.includes(sid)) {
            if ( notMe && notYetJoined) {
                // 1. add circleMarker
                // let markerOption = {
                //     color: colorReference[userID].color,
                //     fillOpacity: 0.7
                // };
                // let markerToAdd = L.circleMarker([partners[sid][0].latitude, partners[sid][0].longitude], markerOption).addTo(map);

                // 1. add icon
                const myIcon = L.icon({
                    iconUrl: partners[sid]["image_url"],
                    iconSize: [40, 40],
                    className: "icon-on-map"
                });
                let markerToAdd = L.marker([partners[sid]["coordination"][0].latitude, partners[sid]["coordination"][0].longitude], 
                                    {icon: myIcon}).addTo(map);
    
                // 2. register new partner information (sid, circleMaker object)
                sidArray.push(sid);
                markerArray.push(markerToAdd);
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


