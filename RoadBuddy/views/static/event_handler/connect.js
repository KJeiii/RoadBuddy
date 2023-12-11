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
    socket.emit("initial_team_status");
    console.log(`${window.sessionStorage.getItem("username")} send online status`)
})

socket.on("initialization", () => {
    socket.emit("initial_friend_status");
    socket.emit("online_friend_status");
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