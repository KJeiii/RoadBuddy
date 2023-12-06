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
        let//
        item = document.createElement("div"),
        icon = document.createElement("div"),
        username = document.createElement("div");
    
        item.setAttribute("class", "item");
        icon.setAttribute("class", "icon");
        icon.style.backgroundColor = partnersColor[id].color;
        username.setAttribute("class", "username");
        username.setAttribute("id", id);
        username.textContent = partnersColor[id].username;

        item.appendChild(icon);
        item.appendChild(username);
        partnersList.appendChild(item);
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
    socket.emit("enter_team", createTeamData)
    console.log(`Send team request from ${window.sessionStorage.getItem("username")}`);
})


// ----- listener to event "team_request" -----
var team_sender_info_cache;
socket.on("team_request", (data) => {
    console.log(`Receive team request from ${data.username}`);
    team_sender_info_cache = data

    // prompt to ask willness
    let//
    prompt = document.querySelector(".team-prompt"),
    content = document.querySelector(".team-prompt .content");

    content.textContent = `來自 ${data.username} 的隊伍邀請`;
    prompt.style.display = "block";
})


// ----- receiver response to team invitation -----
// if accept 
let teamYesBtn = document.querySelector(".team-prompt .yes");
teamYesBtn.addEventListener("click", () => {
    console.log("click")
    // switch to tracking pannel
    mainPannel.style.display = "none";
    friendsPannel.style.display = "none";
    teamsPannel.style.display = "none";
    trackingPannel.style.display = "block";
    
    // create partner information in partners-list
    let partnersList = document.querySelector(".tracking-pannel .partners-list");
    console.log(team_sender_info_cache.friends_color);
    for ( id in team_sender_info_cache.friends_color) {
        let//
        item = document.createElement("div"),
        icon = document.createElement("div"),
        username = document.createElement("div");
    
        item.setAttribute("class", "item");
        icon.setAttribute("class", "icon");
        icon.style.backgroundColor = team_sender_info_cache.friends_color[id].color;
        username.setAttribute("class", "username");
        username.setAttribute("id", id);
        username.textContent = team_sender_info_cache.friends_color[id].username;

        item.appendChild(icon);
        item.appendChild(username);
        partnersList.appendChild(item);
    }

    // change elements in setting div
    settingOnMain.style.display = "none";
    settingOffMain.style.display = "none";
    settingOnTracking.style.display = "block";
    settingOffTracking.style.display = "none";

    // recover team prompt
    let//
    prompt = document.querySelector(".team-prompt"),
    content = document.querySelector(".team-prompt .content");
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
})

// if reject
let teamNoBtn = document.querySelector(".team-prompt .no");
teamNoBtn.addEventListener("click", () => {
    let//
    prompt = document.querySelector(".team-prompt"),
    content = document.querySelector(".team-prompt .content"),
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
    console.log(`Reject response emitted to server`);

    // show response
    let//
    response = document.querySelector(".team-response"),
    responseContent = document.querySelector(".team-response .content");

    response.style.display = "block";
    responseContent.textContent = `你已拒絕 ${team_sender_info_cache.username} 的隊伍邀請`;    
    team_sender_info_cache = "";
})


// ----- confirm team response -----
let teamOkBtn = document.querySelector(".team-response button");
teamOkBtn.addEventListener("click", ()=>{

    // recover response
    let//
    response = document.querySelector(".team-response"),
    responseContent = document.querySelector(".team-response .content");

    response.style.display = "none";
    responseContent.textContent = ``;     
})


// ----- listener for receiving "join_team" event from server ----- 
// ----- and emit user initial position to listener "position" on server -----
socket.on("enter_team", (sid_reference) => {
    sidReference = sid_reference;
    console.log(`type of team_id in browser session : ${typeof(sessionStorage.getItem("team_id"))}`);
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

    console.log(`initialCoord in listener "enter_team on client ${data.coord.latitude}, ${data.coord.longitude}`);
    socket.emit("position", data);
})


// ----- emit leave team event to listener "leave_team" on server-----
let leaveTeamBtn = document.querySelector(".setting div.leave");
leaveTeamBtn.addEventListener("click", ()=> {
    let data = {
        sid: socket.id,
        team_id: window.sessionStorage.getItem("team_id"),
        username: window.sessionStorage.getItem("username"),
        user_id: window.sessionStorage.getItem("user_id"),
        email: window.sessionStorage.getItem("email")
    };
    socket.emit("leave_team", data);
    window.sessionStorage.removeItem("team_id");

    // change elements in setting div
    settingOnMain.style.display = "block";
    settingOffMain.style.display = "none";
    settingOnTracking.style.display = "none";
    settingOffTracking.style.display = "none";
})

socket.on("leave_team", (data) => {
    let sid = data.sid;
    markerArray.splice(sidArray.indexOf(sid),1);
    sidArray.splice(sidArray.indexOf(sid),1);
})


// -------- msg test for room -------
// test leave team for alert message
let msgleaveTeamBtn = document.querySelector("div.alert button.leave");
msgleaveTeamBtn.addEventListener("click", ()=> {
    // switch to main pannel
    friendsPannel.style.display = "none";
    teamsPannel.style.display = "none";
    trackingPannel.style.display = "none";
    mainPannel.style.display = "none";

    // change elements in setting div
    config.style.display = "none";
    logout.style.display = "none";
    leave.style.display = "none";

    // organize data for emitted to event listener "leave_team" on server
    let data = {
        team_id: `${window.sessionStorage.getItem("team_id")}`,
        username: window.sessionStorage.getItem("username"),
        user_id: window.sessionStorage.getItem("user_id"),
        email: window.sessionStorage.getItem("email")
    };
    socket.emit("leave_team", data);
    window.sessionStorage.removeItem("team_id");
})


// test alert msg emitted to room
let alertBtn = document.querySelector("button.alert");
alertBtn.addEventListener("click", ()=>{
    let//
    msg = document.querySelector("div.alert input").value,
    data = {
        team_id: `${window.sessionStorage.getItem("team_id")}`,
        msg: msg,
        user_id: window.sessionStorage.getItem('user_id'),
        username: window.sessionStorage.getItem('username'),
        email: window.sessionStorage.getItem('email'),
    };

    socket.emit("alert", data);
    console.log(`${window.sessionStorage.getItem("username")} send ${msg}`);
})

socket.on("alert", (data)=>{
    console.log(`Receive ${data.msg} from ${data.username}`);

    let//
    msg = data.msg,
    alert = document.querySelector("div.alert"),
    msgDiv = document.createElement("div");

    msgDiv.textContent = msg;
    alert.appendChild(msgDiv);
})
