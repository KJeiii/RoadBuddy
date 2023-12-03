

let addFriendBtn = document.querySelector(".friends-pannel button");
addFriendBtn.addEventListener("click", () => {
    console.log("click");
    let//
    checkboxes = document.querySelectorAll(".friends-pannel input[type=checkbox]"),
    friendID = [];

    for ( checkbox of checkboxes) {
        if ( checkbox.checked ) { friendID.push(checkbox.getAttribute("id")*1)}
    }

    // send request for adding friend
    let data = {
        sender_sid: socket.id,
        receiver_id: friendID
    }
    socket.emit("friend_reqeust", data);
    
    console.log(`Send request from ${window.sessionStorage.getItem("sid")}`);
});



// *** as a receiver
var friend_sender_info_cache;
socket.on("friend_request", (data) => {
    console.log(`Receive request from ${data.username}`);
    friend_sender_info_cache = data;

    // prompt to ask willness
    let//
    prompt = document.querySelector(".friend-prompt"),
    content = document.querySelector(".friend-prompt .content");

    content.textContent = `來自 ${data.username} 的好友邀請`;
    prompt.style.display = "block";
})

// if accept request
let yesBtn = document.querySelector(".yes");
yesBtn.addEventListener("click", () => {
    console.log("click")
    // recover friend prompt
    let//
    prompt = document.querySelector(".friend-prompt"),
    content = document.querySelector(".friend-prompt .content");

    content.textContent = "";
    prompt.style.display = "none";

    console.log(friend_sender_info_cache);

    // receiver fetch api to add friend
    fetch("/api/friend/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: window.sessionStorage.getItem("user_id"),
            friend_id: friend_sender_info_cache.user_id})
        })
        .then((response) => {return response.json()})
        .then((result) => {
            while ( mainPannelFriendsList.hasChildNodes() ) {
                mainPannelFriendsList.removeChild(mainPannelFriendsList.lastChild)
            }

            LoadFriendList(window.sessionStorage.getItem("user_id"));
            friendsPannel.style.display = "none";
            mainPannel.style.display = "block";
        })
        .catch((error) => {console.log(`Error in add new friend : ${error}`)})
        
    // feedback result to sender
    let data = {
        accept: true,
        receiver_sid: socket.id,
        sender_info: {
            sid: friend_sender_info_cache.sid,
            user_id: friend_sender_info_cache.user_id,
            username: friend_sender_info_cache.username,
            email: friend_sender_info_cache.email
        }
    };

    socket.emit("friend_request_result", data);
    console.log(`Accept response sent back to ${friend_sender_info_cache.username}`);

    // show response
    let//
    response = document.querySelector(".friend-response"),
    responseContent = document.querySelector(".friend-response .content");

    response.style.display = "block";
    responseContent.textContent = `你與 ${friend_sender_info_cache.username} 已結為好友`;
    friend_sender_info_cache = "";
})

// if reject request
let noBtn = document.querySelector(".no");
noBtn.addEventListener("click", () => {
    let//
    prompt = document.querySelector(".friend-prompt"),
    content = document.querySelector(".friend-prompt .content"); 
    content.textContent = "";
    prompt.style.display = "none";

    // feedback result to sender
    let data = {
        accept: false,
        receiver_sid: socket.id,
        sender_info: friend_sender_info_cache
    }
    socket.emit("friend_request_result", data)
    console.log(`Reject reponse sent back to ${friend_sender_info_cache.username}`)


    // show response
    let//
    response = document.querySelector(".friend-response"),
    responseContent = document.querySelector(".friend-response .content");

    response.style.display = "block";
    responseContent.textContent = `你已拒絕 ${friend_sender_info_cache.username} 的好友邀請`;    
    friend_sender_info_cache = "";
})

// *** as a sender
socket.on("friend_request_result", (data) => {
    console.log(data);
    console.log(`Receive response from ${data.receiver_info.username}`);

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
                while ( mainPannelFriendsList.hasChildNodes() ) {
                    mainPannelFriendsList.removeChild(mainPannelFriendsList.lastChild)
                }

                LoadFriendList(window.sessionStorage.getItem("user_id"));
                friendsPannel.style.display = "none";
                mainPannel.style.display = "block";

                console.log(`${window.sessionStorage.getItem("username")} add ${data.receiver_info.username}`);


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
let okBtn = document.querySelector(".friend-response button");
okBtn.addEventListener("click", ()=>{

    // recover response
    let//
    response = document.querySelector(".friend-response"),
    responseContent = document.querySelector(".friend-response .content");

    response.style.display = "none";
    responseContent.textContent = ``;     
})