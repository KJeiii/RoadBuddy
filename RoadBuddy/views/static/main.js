import { CheckUserStatus } from "./Utils/ManageUser.js";
import { SearchTeams } from "./Utils/ManageTeam.js";
import { SearchOldFriends } from "./Utils/ManageFriend.js";
import { ClearList, RenderList, RenderOnlineStatus, InitializeAllPannelsTagAttributes } from "./Utils/GeneralControl.js";
import { DrawMap } from "./Utils/DrawMap.js";
import * as GeneralEvents from "./Utils/GeneralEvent.js";
import { ManipulateSessionStorage, OnlineUserInfo } from "./Utils/ManageUser.js";
import { AddTeamClickEvent, AddTeamHoverEvent } from "./Utils/TeamEvent.js";
import { OnlineFriendInfo, EmitUpdateOnlineStatusEvents } from "./Utils/ManageFriend.js";
import { SearchMessage, MessageInfo, RenderMessageBtn } from "./Utils/ManageMessage.js";


// create onlineFriendInfo  and messageInfo objects
export const//
    onlineFriendInfo = new OnlineFriendInfo(),
    messageInfo = new MessageInfo(),
    onlineUserInfo = new OnlineUserInfo();


// check user status and load info when passing check
CheckUserStatus()
    .then((result) => {
        if (!result.ok){window.location.replace("/member")};

        const {user_id:userID, username} = result.data;
        // EmitStoreUserInfoEvent(userID, username, email, oldFriendList);
        // update main-pannel description
        let description = document.querySelector(".main-pannel .description").textContent;
        document.querySelector(".main-pannel .description").textContent = description + ` ${username}`;
        
        // store user info
        sidArray.push(socket.id);
        ManipulateSessionStorage("clear");
        ManipulateSessionStorage("set", {...result.data, sid: socket.id})

        
        // render friend list
        SearchOldFriends(userID)
            .then((oldFriendList) => {
                    socket.emit("initial_team_status");
                    // fetch online friendsArray and notify own online status
                    EmitUpdateOnlineStatusEvents();

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
        SearchTeams(userID, "created")
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
        SearchTeams(userID, "joined")
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
        SearchMessage(userID)
            .then((result) => {
                result.forEach((message) => {messageInfo.UpdateInfo(message)});
                ClearList(".message-list");
                RenderList(".message-list", messageInfo.GetSenderList());
                RenderMessageBtn(false);
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

// Add events to general DOM elements
for (let event of GeneralEvents.AllEvents) {event()}    





// ----- draw initial map -----
// if (window.navigator.geolocation) {
//     try {
//         window.navigator.geolocation.getCurrentPosition(drawMap, userCoordError);
//     }
//     catch(error) {console.log(`Error in getting user postion : ${error}`)}
// }






