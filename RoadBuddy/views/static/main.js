import { CheckUserStatus, EmitStoreUserInfoEvent, MessageUserInfo } from "./Utils/ManageUser.js";
import { SearchTeams } from "./Utils/ManageTeam.js";
import { SearchOldFriends } from "./Utils/ManageFriend.js";
import { ClearList, RenderList, RenderOnlineStatus, InitializeAllPannelsTagAttributes } from "./Utils/GeneralControl.js";
import { DrawMap, UserCoordError } from "./Utils/DrawMap.js";
import * as GeneralEvents from "./Utils/GeneralEvent.js";
import { ManipulateSessionStorage } from "./Utils/ManageUser.js";
import { AddTeamClickEvent, AddTeamHoverEvent } from "./Utils/TeamEvent.js";
import { OnlineFriendInfo } from "./Utils/ManageFriend.js";
import { SearchMessage } from "./Utils/ManageMessage.js";

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
            ManipulateSessionStorage("set", {...data, sid: socket.id})
            
            // render friend list
            SearchOldFriends(data.user_id)
                .then((oldFriendList) => {
                        const {user_id, username, email} = data;
                        EmitStoreUserInfoEvent(user_id, username, email, oldFriendList);
                        socket.emit("initial_team_status");
                        ManipulateSessionStorage("set", {friendList: JSON.stringify(oldFriendList)})
                        // window.sessionStorage.setItem("friendList", JSON.stringify(oldFriendList))
                        ClearList(".main-pannel .friend-list");
                        RenderList(".main-pannel .friend-list", oldFriendList);
                        RenderOnlineStatus(".main-pannel .friend-list .item", oldFriendList);
                        
                        ClearList(".team-pannel .friend-list");
                        RenderList(".team-pannel .friend-list", oldFriendList);
                        RenderOnlineStatus(".team-pannel .friend-list .item", oldFriendList);
                    })
                .catch((error)=>{console.log(error)})
            
            // render team list
            // 1. created team list
            SearchTeams(data.user_id, "created")
                .then((result) => {
                    createdTeamArray = [...result.createdTeamList];
                    ClearList(".create-list");
                    RenderList(".create-list", result.createdTeamList);
                    AddTeamClickEvent(".create-list .item");
                    AddTeamHoverEvent(".create-list .item");
                })
                .catch((error) => console.log(
                    `Error in render created team list (main.js):${error}`
                ))
                
            // 2. joined team list 
            SearchTeams(data.user_id, "joined")
                .then((result) => {
                    joinedTeamArray = [...result.joinedTeamList];
                    ClearList(".join-list");
                    RenderList(".join-list", result.joinedTeamList);
                    RenderOnlineStatus(".join-list .item", onlineTeamArray);
                    AddTeamClickEvent(".join-list .item", onlineTeamArray);
                    AddTeamHoverEvent(".join-list .item");
                })
                .catch((error) => console.log(
                    `Error in render joined team list (main.js):${error}`
                ))

            // 3. render message list
            SearchMessage(window.sessionStorage.getItem("user_id"))
                .then((result) => {
                    ClearList(".message-list");
                    RenderList(".message-list", result);
                })
                .catch((error) => {console.log(
                    `Error in render message list (main.js):${error}`
                )})

            // 4. initialize four pannels style.display in tag attribute
            InitializeAllPannelsTagAttributes();

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

// Add events to general DOM elements
for (let event of GeneralEvents.AllEvents) {event()}


//4. create onlineFriendInfo object
export const onlineFriendInfo = new OnlineFriendInfo();


// ----- draw initial map -----
// if (window.navigator.geolocation) {
//     try {
//         window.navigator.geolocation.getCurrentPosition(drawMap, userCoordError);
//     }
//     catch(error) {console.log(`Error in getting user postion : ${error}`)}
// }






