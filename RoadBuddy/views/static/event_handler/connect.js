// ----- declare global variables -----
var//
sidArray = [],
markerArray = [];
// ----- initialize socket.io -----
let socket = io();
socket.on("connect", ()=>{
    sidArray.push(socket.id);
    markerArray.push(marker);
    window.sessionStorage.setItem("sid", socket.id);

    let data = {
        user_id: window.sessionStorage.getItem("user_id"),
        username: window.sessionStorage.getItem("username"),
        email: window.sessionStorage.getItem("email")
    }
    socket.emit("store_userinfo", data);

    // let//
    // alertDiv = document.querySelector(".alert"),
    // sidDiv = document.createElement("div");

    // sidDiv.textContent = socket.id;
    // alertDiv.appendChild(sidDiv);
})


// remove marker when user disconnects
// Case-1. close brwoser directly
socket.on("disconnect", (data) => {
    let sid = data.sid;
    map.removeLayer(markerArray[sidArray.indexOf(sid)]);
    markerArray.splice(sidArray.indexOf(sid),1);
    sidArray.splice(sidArray.indexOf(sid),1);
});


// Case-2. press "leave" button
let leaveBtn = document.querySelector(".leave");
leaveBtn.addEventListener("click", () => {
    window.location.replace("/room");
});



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