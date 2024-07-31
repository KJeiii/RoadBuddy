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


