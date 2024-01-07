let addFriendBtn = document.querySelector(".friends-pannel button");
addFriendBtn.addEventListener("click", () => {
    console.log("click");
    let//
    checkboxes = document.querySelectorAll(".friends-pannel input[type=checkbox]"),
    friendID = [];

    fetch("/api/friend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({user_id: window.sessionStorage.getItem("user_id")})
    })
     .then((response) => {return response.json()})
     .then((result) => {
        let data = result.data;

        // find all old friends user_id
        let oldFriendId = [];
        for ( datum of data ) {
            oldFriendId.push(datum["user_id"])
        }

        // find all new friends user_id
        for ( checkbox of checkboxes) {
            if ( checkbox.checked ) { friendID.push(checkbox.getAttribute("id")*1)}
        }

        //  response if no ckeckbox is checked
        if ( friendID.length === 0 ) {
            let//
            response = document.querySelector(".friend-request"),
            responseContent = document.querySelector(".friend-request .content");
    
            response.style.display = "block";
            responseContent.textContent = "你尚未選擇對象";
            return
        }

        // mapping each new friend if it's in oldFriendId
        let//
        repeatID = [],
        uniqueID = [];
        for ( friend of friendID ) {
            if ( oldFriendId.includes(friend) ) {
                repeatID.push(friend)
                continue
            }
            uniqueID.push(friend);
        }

        // Decide if it is allowed to send friend request
        let//
        allowToSend = (repeatID.length > 0) ? false:true,
        statement = `已發出交友申請`;


        // NOT allowed if they have been friend between user and one of selected people
        if (!allowToSend) {
            let repeatIDString = "";
            for ( friend of data) {
                if ( repeatID.includes(friend.user_id) ) {
                    repeatIDString += ` ${friend.username} `;
                }}
            statement = `你與${repeatIDString}已經是好友關係，請重新選擇對象`;
        }

        let//
        response = document.querySelector(".friend-request"),
        responseContent = document.querySelector(".friend-request .content");

        response.style.display = "block";
        responseContent.textContent = statement;


        // Allowed if friendship has not benn built yet 
        if ( allowToSend && uniqueID.length !== 0 ) {
            let sender_data = {
                sender_sid: socket.id,
                receiver_id: uniqueID
            }
            socket.emit("friend_reqeust", sender_data);
            console.log(`Send request from ${window.sessionStorage.getItem("sid")}`);
        }
     })
});

// clear response content and disappear
document.querySelector(".friend-request button").addEventListener("click", ()=>{
    let//
    response = document.querySelector(".friend-request"),
    responseContent = document.querySelector(".friend-request .content");

    response.style.display = "none";
    responseContent.textContent = "";
});

// *** as a receiver
var friend_sender_info_cache;
socket.on("friend_request", (data) => {
    friend_sender_info_cache = data;

    // prompt to ask willness
    let//
    prompt = document.querySelector(".friend-prompt"),
    content = document.querySelector(".friend-prompt .content");

    content.textContent = `來自 ${data.username} 的好友邀請`;
    prompt.style.display = "block";
})

// if accept request
let friendYesBtn = document.querySelector(".friend-prompt .yes");
friendYesBtn.addEventListener("click", () => {
    // recover friend prompt
    let//
    prompt = document.querySelector(".friend-prompt"),
    content = document.querySelector(".friend-prompt .content");

    content.textContent = "";
    prompt.style.display = "none";


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

            // update latest friend list
            // 1. remove old list
            while ( mainPannelFriendsList.hasChildNodes() ) {
                mainPannelFriendsList.removeChild(mainPannelFriendsList.lastChild)
            }

            // 2. create new list
            LoadFriendList(window.sessionStorage.getItem("user_id"))
            // friendsPannel.style.display = "none";
            // mainPannel.style.display = "block";
             .then(() => {
                friendsPannel.style.display = "none";
                mainPannel.style.display = "block";

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
             .catch((error) => {console.log(error)})
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

    // show response
    let//
    response = document.querySelector(".friend-response"),
    responseContent = document.querySelector(".friend-response .content");

    response.style.display = "block";
    responseContent.textContent = `你與 ${friend_sender_info_cache.username} 已結為好友`;
    friend_sender_info_cache = "";
})

// if reject request
let friendNoBtn = document.querySelector(".friend-prompt .no");
friendNoBtn.addEventListener("click", () => {
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
        for ( item of mainPannelFriendItems ) {
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
        for ( item of teamPannelFriendItems ) {
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
    for ( item of mainPannelFriendItems ) {
        if (item.getAttribute("id")*1 === data["user_id"]*1) {
            item.style.backgroundColor = "rgb(182, 232, 176)";
            item.style.border = "solid 3px rgb(22, 166, 6)";
            break
        }
    }


    // update friend list in team pannel
    // update item.style.display to flex when friend is on-line
    let teamPannelFriendItems = document.querySelectorAll(".teams-pannel .friends-list .item");
    for ( item of teamPannelFriendItems ) {
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
    for ( item of mainPannelFriendItems ) {
        if (item.getAttribute("id")*1 === data["user_id"]*1) {
            item.style.backgroundColor = "rgb(235, 234, 234)";
            item.style.border = "solid 3px rgb(182, 181, 181)";
            break
        }
    }


    // 2. update friend list in team pannel (display switches to "none")
    let teamPannelFriendItems = document.querySelectorAll(".teams-pannel .friends-list .item");
    for ( item of teamPannelFriendItems ) {
        if (item.getAttribute("id")*1 === data["user_id"]*1) {
            item.style.display = "none";
            break
        }
    }
})



