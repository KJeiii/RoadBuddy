import { CheckUserStatus } from "./Utils/ManageUser.js";
import { SearchTeams } from "./Utils/ManageTeams.js";
import { SearchOldFriends } from "./Utils/ManageFriend.js";
import { ClearList, RenderList, RenderOnlineStatus } from "./Utils/GeneralControl.js";
import { DrawMap, UserCoordError } from "./Utils/DrawMap.js";
import * as AddEvents from "./Utils/AddEvents.js";
import { ManipulateSessionStorage } from "./Utils/ManageUser.js";

// ----- initialize socket.io -----
socket.on("connect", ()=>{
    // check user status and load info when passing check
    CheckUserStatus()
        .then((result) => {
            if (!result.ok){window.location.replace("/member")};

            let data = result.data;
            // update main-pannel description
            let description = document.querySelector(".main-pannel .description").textContent;
            document.querySelector(".main-pannel .description").textContent = description + ` ${data.username}`;
            
            // store user info
            sidArray.push(socket.id);
            ManipulateSessionStorage("clear");
            ManipulateSessionStorage("store", {...data, sid: socket.id})
            
            // render friend list
            SearchOldFriends(data.user_id)
            .then((oldFriendList) => {
                    socket.emit("store_userinfo", {...data, friend_list: oldFriendList});
                    socket.emit("initial_team_status");
                    ManipulateSessionStorage("store", {friendList: JSON.stringify(oldFriendList)})
                    // window.sessionStorage.setItem("friendList", JSON.stringify(oldFriendList))
                    ClearList(".main-pannel .friends-list");
                    RenderList(".main-pannel .friends-list", oldFriendList);
                    RenderOnlineStatus(".main-pannel .friends-list .item", oldFriendList);
                    
                    ClearList(".teams-pannel .friends-list");
                    RenderList(".teams-pannel .friends-list", oldFriendList);
                    RenderOnlineStatus(".teams-pannel .friends-list .item", oldFriendList);

                })
                .catch((error)=>{console.log(error)})
            

            // render team list
            // 1. created team list
            SearchTeams(data.user_id, "created")
                .then((result) => {
                    ClearList(".main-pannel .create-list");
                    RenderList(".create-list", result.createdTeamList);
                    AddEvents.AddEventsToTeamItems("created");
                })
                .catch((error) => console.log(
                    `Error in render created team list (room.js):${error}`
                ))
                
                // 2. joined team list 
                SearchTeams(data.user_id, "joined")
                .then((result) => {
                    ClearList(".main-pannel .join-list");
                    RenderList(".join-list", result.joinedTeamList);
                    AddEvents.AddEventsToTeamItems("joined");
                })
                .catch((error) => console.log(
                    `Error in render joined team list (room.js):${error}`
                ))
        })
        .catch((error) => {
            console.log(error);
        })


    // test user's position by select position from randomPosition
    DrawMap({coords: {
        latitude: 24.982 + Math.random()*0.006,
        longitude: 121.534 + Math.random()*0.006
    }});


})


// // check user status and load info when passing check
// CheckUserStatus()
//     .then((result) => {
//         let data = result.data;
//         // update main-pannel description
//         let description = document.querySelector(".main-pannel .description").textContent;
//         document.querySelector(".main-pannel .description").textContent = description + ` ${data.username}`;

//         // cache username, user_id, email in DOM sessionStorage
//         window.sessionStorage.setItem("username", data.username);
//         window.sessionStorage.setItem("user_id", data.user_id);
//         window.sessionStorage.setItem("email", data.email);
//         window.sessionStorage.removeItem("team_id");

//         // update friends list
//         SearchOldFriends(window.sessionStorage.getItem("user_id"))
//             .then((oldFriendList) => {
//                 window.sessionStorage.setItem("friendList", JSON.stringify(oldFriendList))
//                 ClearList(".main-pannel .friends-list");
//                 RenderList(".main-pannel .friends-list", oldFriendList);

//                 ClearList(".teams-pannel .friends-list");
//                 RenderList(".teams-pannel .friends-list", oldFriendList);
//             })
//             .then(()=>{
//                 console.log(onlineFriendArray)
//                 RenderOnlineStatus(".main-pannel .friends-list .item", onlineFriendArray);
//                 RenderOnlineStatus(".teams-pannel .friends-list .item", onlineFriendArray);
//             })
//             .catch((error)=>{console.log(error)})
         

//         // render team list
//         // 1. created team list
//         SearchTeams(data.user_id, "created")
//             .then((result) => {
//                 ClearList(".main-pannel .create-list");
//                 RenderList(".create-list", result.createdTeamList);
//                 AddEvents.AddEventsToTeamItems("created");
//             })
//             .catch((error) => console.log(
//                 `Error in render created team list (room.js):${error}`
//             ))

//         // 2. joined team list 
//         SearchTeams(data.user_id, "joined")
//             .then((result) => {
//                 ClearList(".main-pannel .join-list");
//                 RenderList(".join-list", result.joinedTeamList);
//                 AddEvents.AddEventsToTeamItems("joined");
//             })
//             .catch((error) => console.log(
//                 `Error in render joined team list (room.js):${error}`
//             ))        
//     })
//     .catch((error) => {
//         console.log(error);
//         window.location.replace("/member");
//     })


// // test user's position by select position from randomPosition
// let testCoords = {
//     latitude: 24.982 + Math.random()*0.006,
//     longitude: 121.534 + Math.random()*0.006
// };
// DrawMap({
//     coords: {
//         latitude: testCoords.latitude,
//         longitude: testCoords.longitude
//     }
// });


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





