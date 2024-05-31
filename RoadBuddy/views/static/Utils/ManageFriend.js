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

export async function SearchOldFriends(userID){ //window.sessionStorage.getItem("user_id")
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

export function CreateItemFetchingCondition(condtionType, ...conditionInfo){
    switch(condtionType){
        case null:
            return null
        case "makeNewFriend":
            return null
        case "inviteJoiningTeam":
            return !Object.keys(conditionInfo[0].partnersColor).includes(conditionInfo[0].itemID)
    }
}

export function FetchSelectedItemIDsByCondition(conditionType, ...reference){
    return function(pannelCssSelector){
        let//
        selectedCheckboxes = document.querySelectorAll(`${pannelCssSelector} input[type=checkbox]`), //.friends-pannel
        itemIDAndNamePairs = []; //[{id:XXX, name:XXX}, {}, {}.....]
        for ( let checkbox of selectedCheckboxes) {
            const//
                itemID = checkbox.getAttribute("id")*1,
                itemName = checkbox.getAttribute("name"),
                fetchingCondition = CreateItemFetchingCondition(conditionType, 
                    {
                        ...reference[0],
                        itemID: itemID
                    }),
                criteria = (fetchingCondition !== null) ? 
                (checkbox.checked && fetchingCondition) : checkbox.checked; //!Object.keys(partnersColor).includes(itemID)
            if ( criteria ) { itemIDAndNamePairs.push({id: itemID, name: itemName})}
        }
        return itemIDAndNamePairs
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

export function ReplyToSender(isAccept, mySocketID, newFriendSocketID, newFriendID){ //SendFriendResponse
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

