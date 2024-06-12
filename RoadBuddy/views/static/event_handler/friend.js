import { SearchOldFriends, MakeNewFriend } from "../Utils/ManageFriend.js";
import { 
    ControlFriendMsgBox, ClearList, RenderList, 
    SwitchPannel, RenderOnlineStatus } from "../Utils/GeneralControl.js";
import { EmitStoreUserInfoEvent } from "../Utils/ManageUser.js";
import { onlineFriendInfo } from "../main.js";

// *** as a receiver
socket.on("friend_request", (data) => {
    friend_sender_info_cache = data;

    // prompt to ask willness
    ControlFriendMsgBox(".friend-prompt", "block", {friendName: data.username})
})

// *** as a sender
socket.on("friend_request_result", (data) => { 

    // if request is accepted
    if (data.accept) {

    // sender fetch api to add friend
        MakeNewFriend(window.sessionStorage.getItem("user_id"), data.receiver_info.user_id)
            .then((response) => {return response.json()})
            .then(() => {
                SearchOldFriends(window.sessionStorage.getItem("user_id"))
                    .then((oldFriendList) => {
                        ClearList(".main-pannel .friend-list");
                        RenderList(".main-pannel .friend-list", oldFriendList);
        
                        ClearList(".team-pannel .friend-list");
                        RenderList(".team-pannel .friend-list", oldFriendList);

                        SwitchPannel("main");
                    })
                    .catch((error)=>{console.log(error)})
                return oldFriendList
            })
            .then((oldFriendList) => {
                // update server friend_list in user_info dict

                let friendList = [];
                for ( friend of oldFriendList ) {
                    let friend_info = {
                        user_id: friend.user_id,
                        username: friend.username
                    };
                    friendList.push(friend_info);
                };
                
                const {user_id, username, email} = window.sessionStorage;
                EmitStoreUserInfoEvent(user_id, username, email, friendList);
            })
            .catch((error) => {console.log(`Error in add new friend : ${error}`)})
    }

    // show response
    ControlFriendMsgBox(".friend-response", "block",
        {
            accept: data.accept,
            senderID: window.sessionStorage.getItem("user_id"),
            senderUsername: window.sessionStorage.getItem("username"),
            receiverID: data.receiver_info.user_id,
            receiverUsername: data.receiver_info.username
        })
})


//  Listener for receiving event "initial_status" event from server
socket.on("update_friend_status", (data) => {
    if (data["update-type"] === "online"){
        data["online_friend_list"].forEach((friend) => {
            const {user_id, user_sid, username} = friend;
            onlineFriendInfo.UpdateInfo(user_id, user_sid, username);
        })
    }

    if (data["update-type"] === "offline"){
        const {user_id} = data["offline_friend_id"];
        onlineFriendInfo.DeleteInfo(user_id)
    }
    
    RenderOnlineStatus(".team-pannel .friend-list .item", onlineFriendInfo.GetAllFriendIDArray());
    RenderOnlineStatus(".main-pannel .friend-list .item", onlineFriendInfo.GetAllFriendIDArray());
})




