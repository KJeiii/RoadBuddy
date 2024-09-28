import { map } from "../Utils/AppClass.js";

// ----- update partners postion when moving -----
socket.on("movingPostion", (partners) => {
    for (const partnerSID in partners){
        if (map.isMarkerCreated(partners[partnerSID].user_id)){
            map.UpdateMarkerPosition(
                partners[partnerSID].user_id, 
                partners[partnerSID]["coordination"]);
        }
    }
});

// ----- change postion randomly -----
setInterval(()=> {
    const//
        randomCoords = {latitude: 24.982 + Math.random()*0.006, longitude: 121.534 + Math.random()*0.006},
        dataToUpdatePosition = { ...window.sessionStorage, coordination: {...randomCoords}},
        notInTeam = window.sessionStorage.getItem("team_id") === "" 
                   || window.sessionStorage.getItem("team_id") === null,
        userID = Number(window.sessionStorage.getItem("user_id"));
    delete dataToUpdatePosition["friendList"];
    if (notInTeam && map.isMarkerCreated(userID)){
        myCoord = {...myCoord, ...randomCoords}
        map.UpdateMarkerPosition(userID, myCoord);
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


