// ----- sender emit invitation to listner "team_request" on server  -----
startTripBtn.addEventListener("click", ()=> {
    // switch to tracking pannel
    mainPannel.style.display = "none";
    friendsPannel.style.display = "none";
    teamsPannel.style.display = "none";
    trackingPannel.style.display = "block";


    // change elements in setting div
    settingOnMain.style.display = "none";
    settingOffMain.style.display = "none";
    settingOnTracking.style.display = "block";
    settingOffTracking.style.display = "none";
    

    // Organize data emitted to listener "enter_team" on server
    let//
    checkboxes = document.querySelectorAll(".teams-pannel .item input[type=checkbox]"),
    friendsToAdd = [],
    teamID = document.querySelector(".teams-pannel .pannel-title").getAttribute("id");
    window.sessionStorage.setItem("team_id", teamID);

    for (checkbox of checkboxes) {
        if (checkbox.checked) {
            friendsToAdd.push(checkbox.getAttribute("id")*1);
            let randomColor = `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`;
            partnersColor[checkbox.getAttribute("id")*1] = {
                username: checkbox.getAttribute("name"),
                color: randomColor
            };
        }
    }
    partnersColor[window.sessionStorage.getItem("user_id")] = {
        username: window.sessionStorage.getItem("username"),
        color: ownColor
    };


    // create partner information in partners-list
    let partnersList = document.querySelector(".tracking-pannel .partners-list");
    for ( id in partnersColor) {
        if (id*1 === window.sessionStorage.getItem("user_id")*1) {
            let//
            item = document.createElement("div"),
            icon = document.createElement("div"),
            username = document.createElement("div");
        
            item.setAttribute("class", "item");
            item.setAttribute("id", id);
            icon.setAttribute("class", "icon");
            icon.style.backgroundColor = partnersColor[id].color;
            username.setAttribute("class", "username");
            username.setAttribute("id", id);
            username.textContent = partnersColor[id].username;
    
            item.appendChild(icon);
            item.appendChild(username);
            partnersList.appendChild(item);
        }
    }

    // send request for joining team
    let invitation = {
        sender_sid: socket.id,
        receiver_info: {
            receiver_id: friendsToAdd,
            receiver_color: partnersColor
        },
        team_id: teamID
    };
    socket.emit("team_request", invitation);

    let createTeamData = {
        accept: true,
        enter_type: "create",
        receiver_info: {
            receiver_id: friendsToAdd,
            receiver_color: partnersColor
        },        
        sender_sid: socket.id,
        team_id: teamID
    };
    socket.emit("enter_team", createTeamData);
    console.log(`Send team request from ${window.sessionStorage.getItem("username")}`);

    // update team using status to other uses
    socket.emit("update_team_status");
    console.log("send team update status event");
})



// ----- receiver response to team invitation -----
// if accept 
let teamYesBtn = document.querySelector(".team-invite-prompt .yes");
teamYesBtn.addEventListener("click", () => {
    // switch to tracking pannel
    mainPannel.style.display = "none";
    friendsPannel.style.display = "none";
    teamsPannel.style.display = "none";
    trackingPannel.style.display = "block";
    
    // create partner information in partners-list
    let partnersList = document.querySelector(".tracking-pannel .partners-list");
    for ( id in team_sender_info_cache.friends_color) {
        if ( id*1 === team_sender_info_cache["user_id"]*1 ) {
            let//
            item = document.createElement("div"),
            icon = document.createElement("div"),
            username = document.createElement("div");
        
            item.setAttribute("class", "item");
            item.setAttribute("id", id);
            icon.setAttribute("class", "icon");
            icon.style.backgroundColor = team_sender_info_cache.friends_color[id].color;
            username.setAttribute("class", "username");
            username.setAttribute("id", id);
            username.textContent = team_sender_info_cache.friends_color[id].username;
    
            item.appendChild(icon);
            item.appendChild(username);
            partnersList.appendChild(item);
        }

        if ( id*1 === window.sessionStorage.getItem("user_id")*1 ) {
            let//
            item = document.createElement("div"),
            icon = document.createElement("div"),
            username = document.createElement("div");
        
            item.setAttribute("class", "item");
            item.setAttribute("id", id);
            icon.setAttribute("class", "icon");
            icon.style.backgroundColor = team_sender_info_cache.friends_color[id].color;
            username.setAttribute("class", "username");
            username.setAttribute("id", id);
            username.textContent = team_sender_info_cache.friends_color[id].username;
    
            item.appendChild(icon);
            item.appendChild(username);
            partnersList.appendChild(item);
        }
    }

    // change elements in setting div
    settingOnMain.style.display = "none";
    settingOffMain.style.display = "none";
    settingOnTracking.style.display = "block";
    settingOffTracking.style.display = "none";

    // recover team prompt
    let//
    prompt = document.querySelector(".team-invite-prompt"),
    content = document.querySelector(".team-invite-prompt .content");
    content.textContent = "";
    prompt.style.display = "none";

    // Organize data emitted to listener "enter_team" on server
    let joinTeamData = {
        accept: true,
        enter_type: "join",
        receiver_sid: socket.id,
        sender_info: team_sender_info_cache,
        team_id: team_sender_info_cache.team_id
    };

    window.sessionStorage.setItem("team_id", team_sender_info_cache["team_id"])
    socket.emit("enter_team", joinTeamData);
    console.log(`Accept response emited to server`);

    // Create partner record in partner table in database
    let payload = {
        team_id: team_sender_info_cache.team_id,
        user_id: window.sessionStorage.getItem("user_id")
    };

    fetch("/api/team", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then((response) => {return response.json()})
    .then((result) => {
        if (result.ok) {
            // update teams list
            LoadTeamList(window.sessionStorage.getItem("user_id"))
            return
        }
        console.log(result.message);
    })
    .catch((error) => {console.log(`Error in accept team request : ${error}`)})
})

// if reject
let teamNoBtn = document.querySelector(".team-invite-prompt .no");
teamNoBtn.addEventListener("click", () => {
    let//
    prompt = document.querySelector(".team-invite-prompt"),
    content = document.querySelector(".team-invite-prompt .content"),
    teamID = document.querySelector(".teams-pannel .pannel-title").getAttribute("id");

    content.textContent = "";
    prompt.style.display = "none";

    // Organize data emitted to listener "enter_team" on server
    let joinTeamData = {
        accept: false,
        enter_type: "join",
        receiver_sid: socket.id,
        sender_info: team_sender_info_cache,
        team_id: teamID
    };

    socket.emit("enter_team", joinTeamData);

    // show response
    let//
    response = document.querySelector(".team-invite-response"),
    responseContent = document.querySelector(".team-invite-response .content");

    response.style.display = "block";
    responseContent.textContent = `你已拒絕 ${team_sender_info_cache.username} 的隊伍邀請`;    
    team_sender_info_cache = "";
})


// ----- confirm team response -----
let teamOkBtn = document.querySelector(".team-invite-response button");
teamOkBtn.addEventListener("click", ()=>{

    // recover response
    let//
    response = document.querySelector(".team-invite-response"),
    responseContent = document.querySelector(".team-invite-response .content");

    response.style.display = "none";
    responseContent.textContent = ``;     
})



// ----- emit leave team event to listener "leave_team" on server-----
let leaveTeamBtn = document.querySelector(".setting div.leave");
leaveTeamBtn.addEventListener("click", ()=> {
    let leader_sid = ( team_sender_info_cache === undefined ) ? socket.id : team_sender_info_cache["sid"];
    let data = {
        sid: socket.id,
        username: window.sessionStorage.getItem("username"),
        user_id: window.sessionStorage.getItem("user_id"),
        email: window.sessionStorage.getItem("email"),
        team_id: window.sessionStorage.getItem("team_id"),
        leader_sid: leader_sid
    };
    socket.emit("leave_team", data);

    // change elements in setting div
    leaveTeamBtn.style.display = "none";
    invite.style.display = "none";
    settingOnMain.style.display = "block";
    settingOffMain.style.display = "none";
    settingOnTracking.style.display = "none";
    settingOffTracking.style.display = "none";

    // remove all partner in the tracking pannel
    let trackingPannelPartnerList = document.querySelector(".tracking-pannel .partners-list");
    while (trackingPannelPartnerList.hasChildNodes()) {
        trackingPannelPartnerList.removeChild(trackingPannelPartnerList.lastChild)
    }

    trackingPannel.style.display = "none";
    teamsPannel.style.display = "none"
    mainPannel.style.display = "block"
})



// ----- switch to team pannel for inviting other frineds in tracking -----
let invitaionBtn = document.querySelector(".setting .invite");
invitaionBtn.addEventListener("click", () => {
    document.querySelector(".teams-pannel .pannel-title").style.display = "none";
    document.querySelector(".teams-pannel .search").style.display = "none";
    invitaionBtn.style.display = "none";
    leaveTeamBtn.style.display = "none";
    settingOffTracking.style.display = "none";
    settingOnTracking.style.display = "block";

    createTeamBtn.style.display = "none";
    startTripBtn.style.display = "none";
    inviteTripBtn.style.display = "block";
    teamsPannel.style.display = "flex";

    let friendItems = document.querySelectorAll(".teams-pannel .friends-list input");
    for ( item of friendItems ) {
        item.checked = false
    }
})


// ----- send invitation while tracking -----
inviteTripBtn.addEventListener("click", () => {
    let//
    friendInputs = document.querySelectorAll(".teams-pannel .friends-list input"),
    friendToInvite = [];

    for ( input of friendInputs ) {
        let user_id = input.getAttribute("id");
        if ( input.checked && !Object.keys(partnersColor).includes(user_id)){
            friendToInvite.push(user_id*1)

            let randomColor = `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`;
            partnersColor[user_id*1] = {
                username: input.getAttribute("name"),
                color: randomColor
            };
        }
    }

    // send request for joining team
    let invitation = {
        sender_sid: socket.id,
        receiver_info: {
            receiver_id: friendToInvite,
            receiver_color: partnersColor
        },
        team_id: window.sessionStorage.getItem("team_id")
    };
    socket.emit("team_request", invitation);
 
    
    // view switch
    document.querySelector(".teams-pannel .close").style.display = "none";
    closeInvitationBtn.style.display = "block";
    mainPannel.style.display = "none";
    teamsPannel.style.display = "none";
    settingOffTracking.style.display = "none";
    settingOnTracking.style.display = "block";
    invitaionBtn.style.display = "none";
    leaveTeamBtn.style.display = "none";
})


// close invitation page
let closeInvitationBtn = document.querySelector(".close-invitation");
closeInvitationBtn.addEventListener("click", () => {
    teamsPannel.style.display = "none";
    mainPannel.style.display = "none";
    document.querySelector(".teams-pannel .close") = "block";
    closeInvitationBtn.style.display = "none";
})


// ----- listener for receiving event "team_request" from server -----
var team_sender_info_cache;
socket.on("team_request", (data) => {
    team_sender_info_cache = data

    // prompt to ask willness
    let//
    prompt = document.querySelector(".team-invite-prompt"),
    content = document.querySelector(".team-invite-prompt .content");

    content.textContent = `來自 ${data.username} 的隊伍邀請`;
    prompt.style.display = "block";
})


// ----- listener for receiving "join_team" event from server ----- 
// ----- and emit user initial position to listener "position" on server -----
socket.on("enter_team", (sid_reference) => {
    sidReference = sid_reference;
    let data = {
        sid : sessionStorage.getItem("sid"),
        user_id : sessionStorage.getItem("user_id"),
        username : sessionStorage.getItem("username"),
        email : sessionStorage.getItem("email"),
        team_id : sessionStorage.getItem("team_id"),
        coord : {
            latitude: initialCoord.latitude,
            longitude: initialCoord.longitude
        }
    };

    socket.emit("position", data);
})



// listener for receiving event "leave_team" from server
socket.on("leave_team", (data) => {
    let//
    sid = data.sid,
    leader_sid = data.leader_sid;

    console.log(socket.id === sid);
    console.log(team_sender_info_cache === undefined);
    // leaving partner:
    if ( socket.id === sid ) {
        console.log("Your'are a leaving partner");

        // 1. remove team_id in browser session
        window.sessionStorage.removeItem("team_id");

        // 2. remove data in markerArray and sidArray
        // only leave own marker and sid
        console.log(markerArray);
        console.log(sidArray);

        let lengthOfSidArray = sidArray.length;
        for ( let i = 0; i < lengthOfSidArray; i++ ) {
            if (sidArray[i] !== socket.id){
                map.removeLayer(markerArray[i]);
                markerArray.splice(i,1);
                sidArray.splice(i,1);
            }
        }
        console.log(markerArray);
        console.log(sidArray);
    }

    // team owner
    if (socket.id === leader_sid && sid !== leader_sid) {
        console.log("You are a team owner");

        // 1. delete leaving partner in partnersColor
        delete partnersColor[data["user_id"]*1]

        // 2. remove leaving partner marker on tracking pannel
        map.removeLayer(markerArray[sidArray.indexOf(sid)]);

        // 3. delete leaving partner in markerArray and sidArray
        markerArray.slice(sidArray.indexOf(sid), 1);
        sidArray.slice(sidArray.indexOf(sid), 1);
    }

    // other partner still in team:
    if (socket.id !== sid && socket.id !== leader_sid) {
        console.log("You're still in team");

        // 1. delete leaving partner in friends color in team_sender_info_cache
        delete team_sender_info_cache["friends_color"][data["user_id"]*1]

        // 2. remove leaving partner marker on tracking pannel
        map.removeLayer(markerArray[sidArray.indexOf(sid)]);

        // 3. delete leaving partner in markerArray and sidArray
        markerArray.slice(sidArray.indexOf(sid), 1);
        sidArray.slice(sidArray.indexOf(sid), 1);
    }
})


//  ----- add new partners if they join -----
socket.on("add_partner", (user_id) => {
    let partnersList = document.querySelector(".tracking-pannel .partners-list");
    // as a team owner
    if ( team_sender_info_cache === undefined ) {
        for ( id in partnersColor) {
            if ( id*1 === user_id*1 ) {
                let//
                item = document.createElement("div"),
                icon = document.createElement("div"),
                username = document.createElement("div");
            
                item.setAttribute("class", "item");
                item.setAttribute("id", id);
                icon.setAttribute("class", "icon");
                icon.style.backgroundColor = partnersColor[id].color;
                username.setAttribute("class", "username");
                username.setAttribute("id", id);
                username.textContent = partnersColor[id].username;
        
                item.appendChild(icon);
                item.appendChild(username);
                partnersList.appendChild(item);
            }
        }
        return
    }

    // as a partner
    for ( id in team_sender_info_cache.friends_color) {
        if ( id*1 === user_id*1 && id*1 !== team_sender_info_cache.user_id*1 && id*1 !== window.sessionStorage.getItem("user_id")*1) {
            let//
            item = document.createElement("div"),
            icon = document.createElement("div"),
            username = document.createElement("div");
        
            item.setAttribute("class", "item");
            item.setAttribute("id", id);
            icon.setAttribute("class", "icon");
            icon.style.backgroundColor = team_sender_info_cache.friends_color[id].color;
            username.setAttribute("class", "username");
            username.setAttribute("id", id);
            username.textContent = team_sender_info_cache.friends_color[id].username;
    
            item.appendChild(icon);
            item.appendChild(username);
            partnersList.appendChild(item);
        }
    }
})


// remove partners when they leave
socket.on("remove_partner", (leaving_partner_data) => {
    let user_id = leaving_partner_data["user_id"]*1;

    let//
    partnersList = document.querySelector(".tracking-pannel .partners-list");
    partnerItems = document.querySelectorAll(".tracking-pannel .partners-list .item");

    for ( item of partnerItems ) {
        if ( item.getAttribute("id")*1 === user_id ) {
            partnersList.removeChild(item);
        }
    }
})


//  Listener for receiving event "update_team_status" event from server
socket.on("update_team_status", (team_online_list) => {
    console.log(team_online_list);

    // update join team list when friend gets online
    // update friend list in main pannel : grey as off-line and green as on-line
    let joinTeamitems = document.querySelectorAll(".main-pannel .join-list .item");
    for ( item of joinTeamitems) {
        if (team_online_list.includes(item.getAttribute("id"))) {
            // 1. change color to  green
            item.style.backgroundColor = "rgb(182, 232, 176)";
            item.style.border = "solid 3px rgb(22, 166, 6)";

            // 2. add event to teams they are in use
            // click event
            item.addEventListener("click", function() {
                document.querySelector(".teams-pannel .pannel-title").textContent = this.textContent;
                document.querySelector(".teams-pannel .pannel-title").setAttribute("id", this.getAttribute("id"));
                document.querySelectorAll(".teams-pannel .pannel-title")[1].style.display = "none";
                document.querySelector(".teams-pannel .search").style.display = "none";
                document.querySelector(".teams-pannel .friends-outer").style.display = "none";
                teamsPannel.style.top = "65vh";
                createTeamBtn.style.display = "none";
                startTripBtn.style.display = "block";
                inviteTripBtn.style.display = "none";
                mainPannel.style.display = "none";
                teamsPannel.style.display = "flex";
                dropDownMain.style.display = "block";
                pullUpMain.style.display = "none";
                createTeamBtn.style.display = "none";
                startTripBtn.style.display = "none";
                inviteTripBtn.style.display = "none";
                joinTripBtn.style.display = "block";
            })
        }
        else{
            // 1. change color to  grey
            item.style.backgroundColor = "rgb(235, 234, 234)";
            item.style.border = "solid 3px rgb(182, 181, 181)";

            // 2. add event to teams they are in use
            // click event
            item.addEventListener("click", function() {
                let//
                teamCreateResponse = document.querySelector(".team-join-response"),
                content = document.querySelector(".team-join-response .content");
                content.textContent = `${this.textContent}的擁有者，尚未啟程`;
                teamCreateResponse.style.display = "block";
                mainPannel.style.top = "65vh";
                dropDownMain.style.display = "none";
                pullUpMain.style.display = "block";
            })
        }
    }
})

// close team-join-response when click ok
let joinOkBtn = document.querySelector(".team-join-response button");
joinOkBtn.addEventListener("click", () => {
    let//
    teamCreateResponse = document.querySelector(".team-join-response"),
    content = document.querySelector(".team-join-response .content");
    teamCreateResponse.style.display = "none";
    content.textContent = ``;
})




// -------- msg test for room -------
// test leave team for alert message
// let msgleaveTeamBtn = document.querySelector("div.alert button.leave");
// msgleaveTeamBtn.addEventListener("click", ()=> {
//     // switch to main pannel
//     friendsPannel.style.display = "none";
//     teamsPannel.style.display = "none";
//     trackingPannel.style.display = "none";
//     mainPannel.style.display = "none";

//     // change elements in setting div
//     config.style.display = "none";
//     logout.style.display = "none";
//     leave.style.display = "none";

//     // organize data for emitted to event listener "leave_team" on server
//     let data = {
//         team_id: `${window.sessionStorage.getItem("team_id")}`,
//         username: window.sessionStorage.getItem("username"),
//         user_id: window.sessionStorage.getItem("user_id"),
//         email: window.sessionStorage.getItem("email")
//     };
//     socket.emit("leave_team", data);
//     window.sessionStorage.removeItem("team_id");
// })


// // test alert msg emitted to room
// let alertBtn = document.querySelector("button.alert");
// alertBtn.addEventListener("click", ()=>{
//     let//
//     msg = document.querySelector("div.alert input").value,
//     data = {
//         team_id: `${window.sessionStorage.getItem("team_id")}`,
//         msg: msg,
//         user_id: window.sessionStorage.getItem('user_id'),
//         username: window.sessionStorage.getItem('username'),
//         email: window.sessionStorage.getItem('email'),
//     };

//     socket.emit("alert", data);
//     console.log(`${window.sessionStorage.getItem("username")} send ${msg}`);
// })

// socket.on("alert", (data)=>{
//     console.log(`Receive ${data.msg} from ${data.username}`);

//     let//
//     msg = data.msg,
//     alert = document.querySelector("div.alert"),
//     msgDiv = document.createElement("div");

//     msgDiv.textContent = msg;
//     alert.appendChild(msgDiv);
// })
