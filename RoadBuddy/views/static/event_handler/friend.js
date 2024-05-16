import * as DOMElements from "../Utils/DOMElements.js";
import { SearchOldFriends, MakeNewFriend } from "../Utils/ManageFriends.js";
import { ControlMsgBox, ClearList, RenderList, RenderOnlineStatus } from "../Utils/GeneralControl.js";

// *** as a receiver
socket.on("friend_request", (data) => {
    friend_sender_info_cache = data;

    // prompt to ask willness
    ControlMsgBox(".friend-prompt", "block", {friendName: data.username})
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
                        ClearList(".main-pannel .friends-list");
                        RenderList(".main-pannel .friends-list", oldFriendList);
        
                        ClearList(".teams-pannel .friends-list");
                        RenderList(".teams-pannel .friends-list", oldFriendList);

                        DOMElements.friendsPannel.style.display = "none";
                        DOMElements.mainPannel.style.display = "block";
                    })
                    .catch((error)=>{console.log(error)})
                console.log(`${window.sessionStorage.getItem("username")} add ${data.receiver_info.username}`);
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
    ControlMsgBox(".friend-response", "block",
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

    RenderOnlineStatus(".teams-pannel .friends-list .item", onlineFriendArray);
    RenderOnlineStatus(".main-pannel .friends-list .item", onlineFriendArray);
})




