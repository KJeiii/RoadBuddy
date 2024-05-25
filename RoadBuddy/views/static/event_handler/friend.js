import * as DOMElements from "../Utils/DOMElements.js";
import { SearchOldFriends, MakeNewFriend } from "../Utils/ManageFriend.js";
import { 
    ControlFriendMsgBox, ClearList, RenderList, 
    SwitchPannel, RenderOnlineStatus } from "../Utils/GeneralControl.js";

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
                        // DOMElements.friendPannel.style.display = "none";
                        // DOMElements.mainPannel.style.display = "block";
                    })
                    .catch((error)=>{console.log(error)})
                return oldFriendList
            })
            .then((oldFriendList) => {
                // update server friend_list in user_info dict

                let friend_list = [];
                for ( friend of oldFriendList ) {
                    let friend_info = {
                        user_id: friend.user_id,
                        username: friend.username
                    };
                    friend_list.push(friend_info);
                };
                
                let data = {
                    user_id: window.sessionStorage.getItem("user_id"),
                    username: window.sessionStorage.getItem("username"),
                    email: window.sessionStorage.getItem("email"),
                    friend_list: friend_list
                };
                socket.emit("store_userinfo", data);
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
        onlineFriendArray.push(...data["online_friend_list"])
    }

    if (data["update-type"] === "offline"){
        onlineFriendArray.splice(onlineFriendArray.indexOf(data["offline_friend_id"]),1)
    }

    RenderOnlineStatus(".team-pannel .friend-list .item", onlineFriendArray);
    RenderOnlineStatus(".main-pannel .friend-list .item", onlineFriendArray);
})




