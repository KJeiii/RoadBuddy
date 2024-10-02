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