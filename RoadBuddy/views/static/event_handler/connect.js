import { onlineUserInfo } from "../main.js";

socket.on("initialization", () => {
    socket.emit("initial_friend_status");
    socket.emit("online_friend_status");
});

//  Listener for receiving event "disconnect" event from server  
socket.on("disconnect", (data) => {
    let sid = data.sid;

    // remove marker when user disconnects
    map.removeLayer(markerArray[sidArray.indexOf(sid)]);

    // clear user cache
    markerArray.splice(sidArray.indexOf(sid),1);
    sidArray.splice(sidArray.indexOf(sid),1);
    
    // clear team_id when partner disconnects
    if (data["user_id"]*1 === window.sessionStorage.getItem("user_id")*1) {
        window.sessionStorage.removeItem("team_id");
    }
});

socket.on("sync_online_user", (userIDArray) => {
    onlineUserInfo.AppendUserID(userIDArray)
})