import { messages, onlineUsers } from "./AppClass.js";
import * as DOMElements from "./DOMElements.js";
import { ReRenderList } from "./GeneralControl.js";
import { ControlFriendMsgBox, SwitchPannel } from "./GeneralControl.js";
import { CreateMessage, SearchMessage } from "./ManageMessage.js";

// ----- build function for searching new friend -----
export async function SearchNewFriends(username) {
    let response = await fetch("/api/friend/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username: username})
    });

    if (!response.ok){throw new Error("Seaching new friend failed (ManageFriends.js)")}

    let//
    result = await response.json(),
    newfriendsList = result.data;
    return newfriendsList;
}

export function RenderSearchResult(friendsList){
    for ( let data of friendsList) {
        let item = document.createElement("div"),
        input = document.createElement("input"),
        label = document.createElement("label");

        item.setAttribute("class", "item")

        input.setAttribute("type", "checkbox");
        input.setAttribute("id", data.user_id);
        input.setAttribute("name", data.username);
        label.setAttribute("for", data.username);
        label.textContent = data.username;

        item.appendChild(input);
        item.appendChild(label);
        DOMElements.searchList.appendChild(item);
    }
}

export async function SearchOldFriends(userID){ //userID
    try {
        let response = await fetch("/api/friend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user_id: userID})
        });

        let//
        result = await response.json(),
        oldFriendList = result.data;
        return oldFriendList
    }
    catch(error){
        console.log(error)
        throw new Error(`Search old friends falied (ManageFriends.js): ${error}`)
    }
}

export function CheckRelationship(selectedFriendIDs, oldFriendList){
    // find all old friends user_id
    let oldFriendId = [];
    for ( let friend of oldFriendList ) {
        oldFriendId.push(friend["user_id"])
    }

    // mapping each new friend if it's in oldFriendId
    let//
    repeatID = [],
    uniqueID = [];
    for ( let friend of selectedFriendIDs ) {
        if ( oldFriendId.includes(friend) ) {
            repeatID.push(friend)
            continue
        }
        uniqueID.push(friend);
    }

    let result = {
        repetitionIDs: repeatID,
        newFriendIDs: uniqueID
    };
    return result
}

function SeperateUserByOnlineStatus(userArrayToSentRequest, onlineUserArray){
    const//
        online = [],
        offline = [];
    for ( let item of userArrayToSentRequest) {
        if (onlineUserArray.includes(item)){online.push(item)}
        else{offline.push(item)} 
    }
    return [online, offline]
}


export function SendFriendRequest(repetitionIDs, newFriendIDs){
    if ( repetitionIDs.length == 0 && newFriendIDs.length !== 0 ) {
        // sync online users array at first
        onlineUsers.EmitSyncOnlineUserEvent();

        const//
            senderID = Number(window.sessionStorage.getItem("user_id")), 
            [onlineUserArray, offlineUserArray] = SeperateUserByOnlineStatus(newFriendIDs, onlineUsers.GetOnlineUserIDArray())
            
        // send message if users are online
        let data = {
            senderID: senderID,
            receiverIDs: onlineUserArray
        };
        socket.emit("friend_reqeust", data);

        // send message if users are offline and have not been sent request yet
        const notYetRequestedUsers = messages.ExtractNotYetRequestedUsers(offlineUserArray);
        if (notYetRequestedUsers.length !== 0) {
            CreateMessage(senderID, notYetRequestedUsers)
                .then(()=>{
                    SearchMessage(senderID)
                        .then((result) => {
                            result.forEach((message) => {messages.UpdateInfo(message)});
                        })
                        .catch((error) => {console.log("Error occured at messages.UpdateInfo(message) in ManageFriend.js:", error)})
                })
                .catch((error) => {console.log("Error occured at CreateMessage() in ManageFriend.js:", error)})
        }
        return
    }
}

export async function MakeNewFriend(myID, newFriendID){
    // receiver fetch api to add friend
    try{
        let response = await fetch("/api/friend/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                user_id: myID,
                friend_id: newFriendID})
            });
        let result = await response.json();
        return result;
    }
    catch(error){
        console.log(`Making new friend failed (ManageFriends.js), ${error}`)
        throw new Error(`Making new friend failed (ManageFriends.js), ${error}`)
    }
}

export function EmitFriendRequestResultEvent(isAccept, ...rest){ //SendFriendResponse
    // feedback result to sender
    const data = {accept: isAccept, ...rest[0]};
    socket.emit("friend_request_result", data);
}

export function UpdateFriends(myID, ...rest){ // rest = {senderID, senderName, receiverID, receiverName}
    // receiver fetch api to add friend
    MakeNewFriend(rest[0].senderID, rest[0].receiverID)
        .then(() => {
            SearchOldFriends(myID)
                .then((oldFriendList) => {
                    // re-render friend list and update online status
                    ReRenderList([".main-pannel .friend-list", ".team-pannel .friend-list"], oldFriendList);
                    socket.emit("initial_friend_status");
                    SwitchPannel("main");
                })
                .catch((error)=>{console.log(error)})
        })
        .then(() => {
            // feedback result to sender
            EmitFriendRequestResultEvent(true, rest[0]);
            // show response
            ControlFriendMsgBox(".friend-response", "block", {accept: true, ...rest[0]});
        })
        .catch((error) => { console.log(error) })
}

export function EmitUpdateOnlineStatusEvents(){
    socket.emit("initial_friend_status");
    socket.emit("online_friend_status");
}