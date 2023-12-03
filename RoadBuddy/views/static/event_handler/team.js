startTripBtn.addEventListener("click", ()=> {
    let//
    checkboxes = document.querySelectorAll(".teams-pannel .item input[type=checkbox]"),
    friendsToAdd = [],
    teamID = document.querySelector(".teams-pannel .pannel-title").getAttribute("id")*1;
    window.sessionStorage.setItem("team_id", teamID);

    for (checkbox of checkboxes) {
        if (checkbox.checked) {
            friendsToAdd.push(checkbox.getAttribute("id")*1)
        }
    }

    // send request for joining team
    let invitation = {
        sender_sid: socket.id,
        receiver_id: friendsToAdd,
        team_id: teamID
    };
    socket.emit("team_request", invitation);

    let joinTeamData = {
        accept: true,
        receiver_sid: socket.id,
        sender_info: team_sender_info_cache,
        team_id: teamID
    };
    socket.emit("join_team", joinTeamData)
    console.log(`Send team request from ${window.sessionStorage.getItem("username")}`);
})

var team_sender_info_cache;
socket.on("team_request", (data) => {
    console.log(`Receive team request from ${data.username}`);
    team_sender_info_cache = data;

    // prompt to ask willness
    let//
    prompt = document.querySelector(".team-prompt"),
    content = document.querySelector(".team-prompt .content");

    content.textContent = `來自 ${data.username} 的隊伍邀請`;
    prompt.style.display = "block";
})


// if accept request
let teamYesBtn = document.querySelector(".team-prompt .yes");
teamYesBtn.addEventListener("click", () => {
    console.log("click")
    // recover team prompt
    let//
    prompt = document.querySelector(".team-prompt"),
    content = document.querySelector(".team-prompt .content");

    content.textContent = "";
    prompt.style.display = "none";

    // socket emit join team to server
    let joinTeamData = {
        accept: true,
        receiver_sid: socket.id,
        sender_info: team_sender_info_cache,
        team_id: team_sender_info_cache.team_id
    };

    window.sessionStorage.setItem("team_id", team_sender_info_cache["team_id"])
    socket.emit("join_team", joinTeamData);
    console.log(`Accept response emited to server`);
})


// if reject request
let teamNoBtn = document.querySelector(".team-prompt .no");
teamNoBtn.addEventListener("click", () => {
    let//
    prompt = document.querySelector(".team-prompt"),
    content = document.querySelector(".team-prompt .content"),
    teamID = document.querySelector(".teams-pannel .pannel-title").getAttribute("id")*1;

    content.textContent = "";
    prompt.style.display = "none";

    // socket emit join team to server
    let joinTeamData = {
        accept: false,
        receiver_sid: socket.id,
        sender_info: team_sender_info_cache,
        team_id: teamID
    };

    socket.emit("join_team", joinTeamData);
    console.log(`Reject response emitted to server`);

    // show response
    let//
    response = document.querySelector(".team-response"),
    responseContent = document.querySelector(".team-response .content");

    response.style.display = "block";
    responseContent.textContent = `你已拒絕 ${team_sender_info_cache.username} 的隊伍邀請`;    
    team_sender_info_cache = "";
})


// confirm team response
let teamOkBtn = document.querySelector(".team-response button");
teamOkBtn.addEventListener("click", ()=>{

    // recover response
    let//
    response = document.querySelector(".team-response"),
    responseContent = document.querySelector(".team-response .content");

    response.style.display = "none";
    responseContent.textContent = ``;     
})

// leave team 
let leaveTeamBtn = document.querySelector("div.alert button.leave");
leaveTeamBtn.addEventListener("click", ()=> {
    let data = {
        team_id: window.sessionStorage.getItem("team_id"),
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
        team_id: window.sessionStorage.getItem("team_id"),
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