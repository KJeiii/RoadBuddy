import * as DOMElements from "../Utils/DOMElements.js";
import {LoadFriendList} from "../Utils/LoadFriendList.js";

// *** as a receiver
socket.on("friend_request", (data) => {
    friend_sender_info_cache = data;

    // prompt to ask willness
    let//
    prompt = document.querySelector(".friend-prompt"),
    content = document.querySelector(".friend-prompt .content");

    content.textContent = `來自 ${data.username} 的好友邀請`;
    prompt.style.display = "block";
})

// *** as a sender
socket.on("friend_request_result", (data) => {

    // if request is accepted
    if (data.accept) {

    // sender fetch api to add friend
        fetch("/api/friend/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                user_id: window.sessionStorage.getItem("user_id"),
                friend_id: data.receiver_info.user_id})
            })
            .then((response) => {return response.json()})
            .then((result) => {
                while ( DOMElements.mainPannelFriendsList.hasChildNodes() ) {
                    DOMElements.mainPannelFriendsList.removeChild(DOMElements.mainPannelFriendsList.lastChild)
                }

                LoadFriendList(window.sessionStorage.getItem("user_id"));
                DOMElements.friendsPannel.style.display = "none";
                DOMElements.mainPannel.style.display = "block";

                console.log(`${window.sessionStorage.getItem("username")} add ${data.receiver_info.username}`);


            })
            .then(() => {
                // update server friend_list in user_info dict

                let//
                friend_list = [],
                friend_items = document.querySelectorAll(".main-pannel .friends-list .item");
                for ( item of friend_items ) {
                    let friend_info = {
                        user_id: item.getAttribute("id"),
                        username: item.textContent
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

            // show response
            let//
            response = document.querySelector(".friend-response"),
            responseContent = document.querySelector(".friend-response .content");
        
            response.style.display = "block";
            responseContent.textContent = `${data.receiver_info.username} 接受你的好友邀請`;
            return
    }
    // if request is rejected
    let//
    response = document.querySelector(".friend-response"),
    responseContent = document.querySelector(".friend-response .content");

    response.style.display = "block";
    responseContent.textContent = `${data.receiver_info.username} 拒絕你的好友邀請`;

})


// confirm frined response
let friendOkBtn = document.querySelector(".friend-response button");
friendOkBtn.addEventListener("click", ()=>{

    // recover response
    let//
    response = document.querySelector(".friend-response"),
    responseContent = document.querySelector(".friend-response .content");

    response.style.display = "none";
    responseContent.textContent = ``;     
})




//  Listener for receiving event "initial_status" event from server
socket.on("update_friend_status", (data) => {
    // initialize friend list for first loggin in
    if (data["email"] === undefined) {

        // update online status (change color) in main pannel friend list
        let mainPannelFriendItems = document.querySelectorAll(".main-pannel .friends-list .item");
        for ( let item of mainPannelFriendItems ) {
            if (Object.keys(data).includes(`${item.getAttribute("id")}`)) {
                item.style.backgroundColor = "rgb(182, 232, 176)";
                item.style.border = "solid 3px rgb(22, 166, 6)";
                continue;
            }

            item.style.backgroundColor = "rgb(235, 234, 234)";
            item.style.border = "solid 3px rgb(182, 181, 181)";
        }

        // update friend list in team pannel
        // update item.style.display to flex when friend is on-line
        let teamPannelFriendItems = document.querySelectorAll(".teams-pannel .friends-list .item");
        for ( let item of teamPannelFriendItems ) {
            if ( Object.keys(data).includes(`${item.getAttribute("id")}`) ) {
                item.style.display = "flex";
                continue;
            }
            item.style.display = "none";
        }
        return
    }

    // update friend list when user is online
    // update online status in main pannel friend list
    let mainPannelFriendItems = document.querySelectorAll(".main-pannel .friends-list .item");
    for ( let item of mainPannelFriendItems ) {
        if (item.getAttribute("id")*1 === data["user_id"]*1) {
            item.style.backgroundColor = "rgb(182, 232, 176)";
            item.style.border = "solid 3px rgb(22, 166, 6)";
            break
        }
    }


    // update friend list in team pannel
    // update item.style.display to flex when friend is on-line
    let teamPannelFriendItems = document.querySelectorAll(".teams-pannel .friends-list .item");
    for ( let item of teamPannelFriendItems ) {
        if (item.getAttribute("id")*1 === data["user_id"]*1) {
            item.style.display = "flex";
            break
        }
    }
})



//  Listener for receiving event "offline_status" event from server
socket.on("offline_friend_status", (data) => {
    // update friend list when user is online
    // 1. update online status in main pannel friend list (color switches to "grey")
    let mainPannelFriendItems = document.querySelectorAll(".main-pannel .friends-list .item");
    for ( let item of mainPannelFriendItems ) {
        if (item.getAttribute("id")*1 === data["user_id"]*1) {
            item.style.backgroundColor = "rgb(235, 234, 234)";
            item.style.border = "solid 3px rgb(182, 181, 181)";
            break
        }
    }


    // 2. update friend list in team pannel (display switches to "none")
    let teamPannelFriendItems = document.querySelectorAll(".teams-pannel .friends-list .item");
    for ( let item of teamPannelFriendItems ) {
        if (item.getAttribute("id")*1 === data["user_id"]*1) {
            item.style.display = "none";
            break
        }
    }
})



