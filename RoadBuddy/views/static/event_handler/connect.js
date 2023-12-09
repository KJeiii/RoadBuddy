// ----- initialize socket.io -----
let socket = io();
socket.on("connect", ()=>{
    sidArray.push(socket.id);
    window.sessionStorage.setItem("sid", socket.id);

    let//
    friend_list = [],
    friend_items = document.querySelectorAll(".main-pannel .friends-list .item");
    console.log(friend_items);
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


//  Listener for receiving event "disconnect" event from server
socket.on("disconnect", (data) => {
    let sid = data.sid;

    // remove marker when user disconnects
    map.removeLayer(markerArray[sidArray.indexOf(sid)]);

    // clear user cache
    markerArray.splice(sidArray.indexOf(sid),1);
    sidArray.splice(sidArray.indexOf(sid),1);
    window.sessionStorage.removeItem("team_id");
});

// let leaveBtn = document.querySelector(".leave");
// leaveBtn.addEventListener("click", () => {
//     // window.location.replace("/room");
//     window.sessionStorage.removeItem("team_id");


// });



//  Listener for receiving event "online_status" event from server
socket.on("online_status", (data) => {
    // update friend list when friend gets online
    // update friend list in main pannel : grey as off-line and green as on-line
    let items = document.querySelectorAll(".main-pannel .friends-list .item");
    for ( item of items) {
        if (item.getAttribute("id")*1 === data.user_id) {
            item.style.backgroundColor = "rgb(182, 232, 176)";
            item.style.border = "solid 3px rgb(22, 166, 6)";
        }
    }

    // update friend list in team pannel : 
    let//
    teamPannelFriendItem = document.createElement("div"),
    input = document.createElement("input"),
    label = document.createElement("label");

    teamPannelFriendItem.setAttribute("class", "item");
    teamPannelFriendItem.setAttribute("id", data.user_id);
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", data.user_id);
    input.setAttribute("name", data.username);
    label.setAttribute("for", data.username);
    label.textContent = data.username
    teamPannelFriendItem.appendChild(input);
    teamPannelFriendItem.appendChild(label);
    teamPannelFriendsList.appendChild(teamPannelFriendItem);
})



//  Listener for receiving event "initial_status" event from server
socket.on("initial_status", (data) => {
    console.log(data);
    let friend_list = data;
    // update online status in main pannel friend list
    items = document.querySelectorAll(".main-pannel .friends-list .item");
    for ( item of items ) {
        if (Object.keys(data).includes(item.getAttribute("id"))) {
            item.style.backgroundColor = "rgb(182, 232, 176)";
            item.style.border = "solid 3px rgb(22, 166, 6)";
        }
    }

    // update friend list in team pannel
    for ( friend_id in friend_list ) {
        let//
        teamPannelFriendItem = document.createElement("div"),
        input = document.createElement("input"),
        label = document.createElement("label");

        teamPannelFriendItem.setAttribute("class", "item");
        teamPannelFriendItem.setAttribute("id", friend_id);
        input.setAttribute("type", "checkbox");
        input.setAttribute("id", friend_id);
        input.setAttribute("name", friend_list[friend_id]);
        label.setAttribute("for", friend_list[friend_id]);
        label.textContent = friend_list[friend_id];
        teamPannelFriendItem.appendChild(input);
        teamPannelFriendItem.appendChild(label);
        teamPannelFriendsList.appendChild(teamPannelFriendItem);
    }
})



//  Listener for receiving event "offline_status" event from server
socket.on("offline_status", (data) => {
    let user_id = data["user_id"];

    // update main pannel friend list
    let mainPannelFriendItems = document.querySelectorAll(".main-pannel .friends-list .item");
    for ( item of mainPannelFriendItems ) {
        if ( item.getAttribute("id")*1 === user_id ) {
            item.style.backgroundColor = "rgb(235, 234, 234)";
            item.style.border = "solid 3px rgb(182, 181, 181)";
        }
    }
    // remove friend from team pannel friend list
    let teamPannelFriendItems = document.querySelectorAll(".teams-pannel .friends-list .item");
    for ( item of teamPannelFriendItems ){
        console.log(item.getAttribute("id")*1);
        console.log(user_id);
        console.log(item.getAttribute("id")*1 === user_id);
        if ( item.getAttribute("id")*1 === user_id ) {
            teamPannelFriendsList.removeChild(item)
        }
    }
})






// let alertBtn = document.querySelector(".alert button");
// alertBtn.addEventListener("click", () => {
//     let data = {
//         sender_sid: window.sessionStorage.getItem("sid"),
//         receiver_sid: document.querySelector(".alert input[name=sid]").value,
//         msg: document.querySelector(".alert input[name=msg]").value
//     };

//     socket.emit("alert", data);
// })

// socket.on("alert", (data) => {
//     let//
//     prompt = document.querySelector(".prompt"),
//     content = document.querySelector(".prompt .content");

//     content.textContent = `Do you want to receive msg from ${data.sender_sid}`;
//     prompt.style.display = "block";

//     let//
//     yesBtn = document.querySelector(".yes"),
//     noBtn = document.querySelector(".no");

//     noBtn.addEventListener("click", () => {
//         content.textContent = "";
//         prompt.style.display = "none";
//     })

//     yesBtn.addEventListener("click", () => {
//         let//
//         alertDiv = document.querySelector(".alert"),
//         msgDiv = document.createElement("div");

//         msgDiv.textContent = data.msg;
//         alertDiv.appendChild(msgDiv);

//         content.textContent = "";
//         prompt.style.display = "none";
//     })
// })