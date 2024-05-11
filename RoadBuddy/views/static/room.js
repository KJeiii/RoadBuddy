import { CheckUserStatus } from "./Utils/CheckUseStatus.js";
import { LoadFriendList } from "./Utils/LoadFriendList.js";
import { LoadTeamList } from "./Utils/LoadTeamList.js";
import { SearchTeams } from "./Utils/ManageTeams.js";
import { ClearList, RenderList } from "./Utils/GeneralControl.js";
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

        // render team list
        // 1. created team list
        // LoadTeamList(data.user_id);
        SearchTeams(data.user_id, "created")
            .then((result) => {
                ClearList(".main-pannel .create-list");
                RenderList(".create-list", result.createdTeamList);
                AddEvents.AddEventsToTeamItems("created");
            })
            .catch((error) => console.log(
                `Error in render created team list (ManageTeams.js):${error}`
            ))

        // 2. joined team list 
        SearchTeams(data.user_id, "joined")
            .then((result) => {
                ClearList(".main-pannel .join-list");
                RenderList(".join-list", result.joinedTeamList);
                AddEvents.AddEventsToTeamItems("joined");
            })
            .catch((error) => console.log(
                `Error in render joined team list (ManageTeams.js):${error}`
            ))        
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
    if (event === AddEvents.AddEventsToTeamItems){continue}
    event()
}





