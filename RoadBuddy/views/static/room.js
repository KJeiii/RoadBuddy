import { CheckUserStatus } from "./Utils/CheckUseStatus.js";
import { LoadFriendList } from "./Utils/LoadFriendList.js";
import { LoadTeamList } from "./Utils/LoadTeamList.js";
import { DrawMap, UserCoordError } from "./Utils/DrawMap.js";
import * as AddEvents from "./Utils/AddEvents.js";

// check user status and load info when passing check
CheckUserStatus()
    .then((result) => {
        let data = result.data;
        // update main-pannel description
        let description = document.querySelector(".main-pannel .description").textContent;
        document.querySelector(".main-pannel .description").textContent = description + ` ${data.username}`;

        // cache username, user_id, email in DOM sessionStorage
        window.sessionStorage.setItem("username", data.username);
        window.sessionStorage.setItem("user_id", data.user_id);
        window.sessionStorage.setItem("email", data.email);
        window.sessionStorage.removeItem("team_id");

        // update friends list
        LoadFriendList(data.user_id);

        // update team list
        LoadTeamList(data.user_id);
        })
    .catch((error) => {
        console.log(error);
        window.location.replace("/member");
    })


// test user's position by select position from randomPosition
let testCoords = {
    latitude: 24.982 + Math.random()*0.006,
    longitude: 121.534 + Math.random()*0.006
};
DrawMap({
    coords: {
        latitude: testCoords.latitude,
        longitude: testCoords.longitude
    }
});


// ----- draw initial map -----
// if (window.navigator.geolocation) {
//     try {
//         window.navigator.geolocation.getCurrentPosition(drawMap, userCoordError);
//     }
//     catch(error) {console.log(`Error in getting user postion : ${error}`)}
// }

for (let event of AddEvents.AllEvents) {
    event()
}





