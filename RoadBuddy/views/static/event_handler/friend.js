import { SearchOldFriends } from "../Utils/ManageFriend.js";
import { ControlFriendMsgBox, RenderOnlineStatus, ReRenderList } from "../Utils/GeneralControl.js";
import { onlineFriends, makeFriendInvitation } from "../Utils/AppClass.js";

// *** as a receiver
socket.on("friend_request", (data) => {
    makeFriendInvitation.StoreObject(data);
    // prompt to ask willness
    ControlFriendMsgBox(".friend-prompt", "block", {friendName: data.username})
})

// *** as a sender
socket.on("friend_request_result", (data) => { 
    // show response
    ControlFriendMsgBox(".friend-response", "block", {accept: data.accept, ...data})
    // re-render friend list
    SearchOldFriends(Number(window.sessionStorage.getItem("user_id")))
        .then((oldFriendList) => {
            ReRenderList([".main-pannel .friend-list", ".team-pannel .friend-list"], oldFriendList);
            // update frined online status
            socket.emit("initial_friend_status");
        })
})


//  Listener for receiving event "initial_status" event from server
socket.on("update_friend_status", (data) => {
    if (data["update-type"] === "online"){
        data["online_friend_list"].forEach((friend) => {
            const {user_id, user_sid, username} = friend;
            onlineFriends.UpdateInfo(user_id, user_sid, username);
        })
    }

    if (data["update-type"] === "offline"){
        const {user_id} = data["offline_friend_id"];
        onlineFriends.DeleteInfo(user_id)
    }
    
    RenderOnlineStatus(".team-pannel .friend-list .item", onlineFriends.GetAllFriendIDArray());
    RenderOnlineStatus(".main-pannel .friend-list .item", onlineFriends.GetAllFriendIDArray());
})




