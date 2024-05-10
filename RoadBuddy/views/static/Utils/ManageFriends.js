import * as DOMElements from "./DOMElements.js";

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

export async function SearchOldFriends(){
    let response = await fetch("/api/friend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({user_id: window.sessionStorage.getItem("user_id")})
    });

    if (!response.ok) {throw new Error("Searching old friends failed (ManageFriends.js)")}
    let//
    result = await response.json(),
    oldFriendsList = result.data;
    return oldFriendsList
}

export function CheckRelationship(oldFriendsList){
    // find all old friends user_id
    let oldFriendId = [];
    for ( let friend of oldFriendsList ) {
        oldFriendId.push(friend["user_id"])
    }

    // find all new friends user_id
    let//
    checkboxes = document.querySelectorAll(".friends-pannel input[type=checkbox]"),
    friendID = [];
    for ( let checkbox of checkboxes) {
        if ( checkbox.checked ) { friendID.push(checkbox.getAttribute("id")*1)}
    }

    //  response if no ckeckbox is checked
    if ( friendID.length === 0 ) {
        let//
        alert = document.querySelector(".friend-request"),
        alertContent = document.querySelector(".friend-request .content");

        alert.style.display = "block";
        alertContent.textContent = "你尚未選擇對象";
        return
    }

    // mapping each new friend if it's in oldFriendId
    let//
    repeatID = [],
    uniqueID = [];
    for ( let friend of friendID ) {
        if ( oldFriendId.includes(friend) ) {
            repeatID.push(friend)
            continue
        }
        uniqueID.push(friend);
    }

    let result = {
        repetitionIDs: repeatID,
        newFriendIDs: uniqueID
    }
    return result
}


export function SendFriendRequest(repetitionIDs, newFriendIDs){
    // Allowed if friendship has not been built yet 
    if ( repetitionIDs.length == 0 && newFriendIDs.length !== 0 ) {
        let sender_data = {
            sender_sid: socket.id,
            receiver_id: newFriendIDs
        }
        socket.emit("friend_reqeust", sender_data);
        console.log(`Send request from ${window.sessionStorage.getItem("sid")}`);
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

export function SendFriendResponse(isAccept, mySocketID, newFriendSocketID, newFriendID){
    // feedback result to sender
    let data = {
        accept: isAccept,
        receiver_sid: mySocketID,
        sender_info: {
            sid: newFriendSocketID,
            user_id: newFriendID,
        }
    };
    socket.emit("friend_request_result", data);
}

