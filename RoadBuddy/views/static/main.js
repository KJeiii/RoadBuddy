import { messages, map, teams} from "./Utils/AppClass.js";
import { ManipulateSessionStorage, CheckUserStatus, ClearCanvasContext, CreateIconImage, 
    GetRandomIconColor, RenderAvatar, RenderEmail, RenderUsername, EmitStoreUserInfoEvent 
} from "./Utils/ManageUser.js";
import { SearchTeams } from "./Utils/ManageTeam.js";
import { SearchOldFriends, EmitUpdateOnlineStatusEvents } from "./Utils/ManageFriend.js";
import { ClearList, RenderList, RenderOnlineStatus, InitializeAllPannelsTagAttributes, ResizeHTMLBodyHeight, RenderTrackingMode 
} from "./Utils/GeneralControl.js";
import * as GeneralEvents from "./Utils/GeneralEvent.js";
import { AddTeamClickEvent, AddTeamHoverEvent } from "./Utils/TeamEvent.js";
import { SearchMessage, RenderMessageBtn } from "./Utils/ManageMessage.js";

ResizeHTMLBodyHeight(); 

// check user status and load info when passing check
CheckUserStatus()
    .then((result) => {
        if (!result.ok){
            localStorage.removeItem("token");
            window.location.replace("/member");
        };

        const {user_id:userID, username, email} = result.data;
        // store user info
        ManipulateSessionStorage("set", {...result.data, sid: socket.id, iconColor: GetRandomIconColor()});
        EmitStoreUserInfoEvent(userID);

        // create imageUrl if user doesn't upload avatar
        const//
            hasAvatar = result.data.image_url !== null,
            imageUrl = (hasAvatar) ? (result.data.image_url) :
                        CreateIconImage(username, window.sessionStorage.getItem("iconColor"));
        (!hasAvatar) && ManipulateSessionStorage("set", {image_url: imageUrl});
        ClearCanvasContext();

        // create map and marker; start updating position
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position)=>{
                const//
                {latitude, longitude} = position.coords,
                initialCoordination = {latitude: latitude, longitude: longitude};
                ManipulateSessionStorage("set", {initialLatitude: latitude, initialLongitude: longitude});
                map.CreateMap(initialCoordination);
                map.CreateMarker(userID, imageUrl, initialCoordination);
            });
            map.TrackRealtimePostion();
            RenderTrackingMode("realtime");
        }
        else{
            map.ChangePositionRandomly();
            RenderTrackingMode("random");
        }

        // update main-pannel description and configure pannel username input
        RenderUsername(username);
        RenderEmail(email);
        RenderAvatar(imageUrl);

        // render friend list
        SearchOldFriends(userID)
            .then((oldFriendList) => {
                    socket.emit("initial_team_status");
                    // fetch online friendsArray and notify own online status
                    EmitUpdateOnlineStatusEvents();

                    ManipulateSessionStorage("set", {friendList: JSON.stringify(oldFriendList)})
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
                teams.UpdateCreatedTeam(...result.createdTeamList);
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
                teams.UpdateJoinedTeam(...result.joinedTeamList);
                ClearList(".join-list");
                RenderList(".join-list", result.joinedTeamList);
                RenderOnlineStatus(".join-list .item", teams.GetOnlineTeams());
                AddTeamClickEvent(".join-list .item", ...teams.GetOnlineTeams());
                AddTeamHoverEvent(".join-list .item");
            })
            .catch((error) => console.log(
                `Error in render joined team list (main.js):${error}`
            ))

        // 3. render message list
        SearchMessage(userID)
            .then((result) => {
                result.forEach((message) => {messages.UpdateInfo(message)});
                ClearList(".message-list");
                RenderList(".message-list", messages.GetSenderList());
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

// Add events to general DOM elements
for (let event of GeneralEvents.AllEvents) {event()}    




