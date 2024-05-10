import { switchPannel, switchToTrackingPannel } from "../Utils/GeneralControl.js";
import { appendPartner, removePartner } from "../Utils/ManagePartners.js";
import * as DOMElements from "../Utils/DOMElements.js";

// ----- sender emit invitation to listner "team_invite" on server  -----
DOMElements.startTripBtn.addEventListener("click", ()=> {
    // switch to tracking pannel
    switchPannel(DOMElements.trackingPannel, DOMElements.settingOnTracking, DOMElements.pullUpTracking);

    // Organize data emitted to listener "enter_team" on server
    let//
    checkboxes = document.querySelectorAll(".teams-pannel .item input[type=checkbox]"),
    friendsToAdd = [],
    teamID = document.querySelector(".teams-pannel .pannel-title").getAttribute("id");
    window.sessionStorage.setItem("team_id", teamID);

    for (let checkbox of checkboxes) {
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


    // create owner information in partners-list;
    // others will be created when they join in
    let partnersList = document.querySelector(".tracking-pannel .partners-list");
    for ( let id in partnersColor) {
        if (id*1 === window.sessionStorage.getItem("user_id")*1) {
            appendPartner(id, partnersList, partnersColor);
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
    socket.emit("team_invite", invitation);

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

    // update team using status to other uses
    socket.emit("update_team_status");
})


// ----- listener for receiving event "team_invite" from server -----
socket.on("team_invite", (data) => {
    team_sender_info_cache = data

    // prompt to ask willness
    let//
    prompt = document.querySelector(".team-invite-prompt"),
    content = document.querySelector(".team-invite-prompt .content");

    content.textContent = `來自 ${data.username} 的隊伍邀請`;
    prompt.style.display = "block";
})


// ----- invited friends decide whether accept team invitation -----
// if accept 
let teamYesBtn = document.querySelector(".team-invite-prompt .yes");
teamYesBtn.addEventListener("click", () => {
    // switch to tracking pannel
    switchPannel(DOMElements.trackingPannel, DOMElements.settingOnTracking);
    
    // create partner information in partners-list
    // 1. only show team owner and partner it self
    // 2. update other partners when they join in
    let partnersList = document.querySelector(".tracking-pannel .partners-list");
    for ( let id in team_sender_info_cache["partners_color"] ) {
        if ( id*1 === team_sender_info_cache["user_id"]*1 ) {
            appendPartner(id, partnersList, team_sender_info_cache["partners_color"]);
        }

        if ( id*1 === window.sessionStorage.getItem("user_id")*1 ) {
            appendPartner(id, partnersList, team_sender_info_cache["partners_color"]);
        }
    }

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
        team_id: team_sender_info_cache.team_id
    };

    window.sessionStorage.setItem("team_id", team_sender_info_cache["team_id"])
    socket.emit("enter_team", joinTeamData);

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



// ----- Listener for receiving "enter_team" event from server ----- 
// ----- and emit event "position" with data of user initial position to server -----
socket.on("enter_team", (data) => {
    sidReference = (data["sender_info"] === undefined) ? data : data["sid_reference"];

    // // Emit event "position" with position data from friends requesting join team
    // if (data["sender_info"] !== undefined ) {
    //     team_sender_info_cache = data["sender_info"]

    //     // requester poistion data
    //     let positionData = data["requester_info"];
    //     socket.emit("position", positionData);
    //     return 
    // }

    // Emit event "postion" with the position data from team owner or friends invited by owner
    let positionData = {
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

    socket.emit("position", positionData);
})



//  ----- add new partners if they join -----
socket.on("add_partner", (user_id) => {
    let partnersList = document.querySelector(".tracking-pannel .partners-list");

    // Team owner updates it's partner list
    if ( team_sender_info_cache === undefined ) {
        for ( let id in partnersColor) {
            if ( id*1 === user_id*1 ) {
                appendPartner(id, partnersList, partnersColor);
            }
        }
        return
    }

    // Partners in team update their partner list
    for ( id in team_sender_info_cache.partners_color) {
        if ( id*1 === user_id*1 && id*1 !== team_sender_info_cache.user_id*1 && id*1 !== window.sessionStorage.getItem("user_id")*1) {
            appendPartner(id, partnersList, team_sender_info_cache["partners_color"]);
        }
    }
})




// ----- confirm team response -----
let teamOkBtn = document.querySelector(".team-invite-response button");
teamOkBtn.addEventListener("click", ()=>{

    // *************************
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

    // *************************
    // switch to mainPannel
    // change elements in setting div
    DOMElements.leaveTeamBtn.style.display = "none";
    DOMElements.invite.style.display = "none";
    DOMElements.settingOnMain.style.display = "block";
    DOMElements.settingOffMain.style.display = "none";
    DOMElements.settingOnTracking.style.display = "none";
    DOMElements.settingOffTracking.style.display = "none";

    DOMElements.trackingPannel.style.display = "none";
    DOMElements.teamsPannel.style.display = "none"
    DOMElements.mainPannel.style.display = "block"

    // remove all partner in the tracking pannel
    let trackingPannelPartnerList = document.querySelector(".tracking-pannel .partners-list");
    while (trackingPannelPartnerList.hasChildNodes()) {
        trackingPannelPartnerList.removeChild(trackingPannelPartnerList.lastChild)
    }
})



// ----- Listener for receiving event "leave_team" from server -----
socket.on("leave_team", (data) => {
    let leavingPartnerSid = data.sid;
    
    // as a leaving partner:
    if ( socket.id === leavingPartnerSid ) {

        // 1. remove team_id in browser session
        window.sessionStorage.removeItem("team_id");

        // 2. remove data in markerArray and sidArray
        // only leave own marker and sid
        let lengthOfSidArray = sidArray.length;
        for ( let i = 0; i < lengthOfSidArray; i++ ) {
            if (sidArray[i] !== socket.id){
                map.removeLayer(markerArray[i]);
                markerArray.splice(i,1);
                sidArray.splice(i,1);
            }
        }

        // 3. clear team_sender_info_cache
        team_sender_info_cache = undefined;
        return
    }

    // as a team owner or partners stay in team
    // 1. delete leaving partner in partnersColor
    if (socket.id === data["leader_sid"]) {
        delete partnersColor[data["user_id"]*1]
    }

    if (socket.id !== data["leader_sid"] && socket.id !== leavingPartnerSid) {
        delete team_sender_info_cache["partners_color"][data["user_id"]*1]
    }


    // 2. remove leaving partner marker on tracking pannel
    map.removeLayer(markerArray[sidArray.indexOf(leavingPartnerSid)]);

    // 3. delete leaving partner in markerArray and sidArray
    markerArray.splice(sidArray.indexOf(leavingPartnerSid), 1);
    sidArray.splice(sidArray.indexOf(leavingPartnerSid), 1);

    // 4. remove partner in tracking pannel
    removePartner(data["user_id"])

})





// ----- While tracking, invite other frineds -----
// open team pannel
let invitationBtn = document.querySelector(".setting .invite");
invitationBtn.addEventListener("click", () => {

    // *************************
    document.querySelector(".teams-pannel .pannel-title").style.display = "none";
    document.querySelector(".teams-pannel .search").style.display = "none";
    DOMElements.invitationBtn.style.display = "none";
    DOMElements.leaveTeamBtn.style.display = "none";
    DOMElements.settingOffTracking.style.display = "none";
    DOMElements.settingOnTracking.style.display = "block";

    DOMElements.createTeamBtn.style.display = "none";
    DOMElements.startTripBtn.style.display = "none";
    DOMElements.inviteTripBtn.style.display = "block";
    DOMElements.teamsPannel.style.display = "flex";

    let friendItems = document.querySelectorAll(".teams-pannel .friends-list input");
    for ( let item of friendItems ) {
        item.checked = false
    }
})


// send invitation
DOMElements.inviteTripBtn.addEventListener("click", () => {
    let//
    friendInputs = document.querySelectorAll(".teams-pannel .friends-list input"),
    friendToInvite = [];

    for ( let input of friendInputs ) {
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

    let invitation = {
        sender_sid: socket.id,
        receiver_info: {
            receiver_id: friendToInvite,
            receiver_color: partnersColor
        },
        team_id: window.sessionStorage.getItem("team_id")
    };
    socket.emit("team_invite", invitation);
 
    // *************************
    // close team pannel and go back to tracking pannel
    document.querySelector(".teams-pannel .close").style.display = "none";
    DOMElements.closeInvitationBtn.style.display = "block";
    DOMElements.mainPannel.style.display = "none";
    DOMElements.teamsPannel.style.display = "none";
    DOMElements.settingOffTracking.style.display = "none";
    DOMElements.settingOnTracking.style.display = "block";
    DOMElements.invitationBtn.style.display = "none";
    DOMElements.leaveTeamBtn.style.display = "none";
})


// close invitation page
let closeInvitationBtn = document.querySelector(".close-invitation");
closeInvitationBtn.addEventListener("click", () => {

    // *************************
    DOMElements.teamsPannel.style.display = "none";
    DOMElements.mainPannel.style.display = "none";
    document.querySelector(".teams-pannel .close") = "block";
    DOMElements.closeInvitationBtn.style.display = "none";
})



//  Listener for receiving event "update_team_status" event from server
// const teamOnline = () => {
//     document.querySelector(".teams-pannel .pannel-title").textContent = this.textContent;
//     document.querySelector(".teams-pannel .pannel-title").setAttribute("id", this.getAttribute("id"));
//     document.querySelectorAll(".teams-pannel .pannel-title")[1].style.display = "none";
//     document.querySelector(".teams-pannel .search").style.display = "none";
//     document.querySelector(".teams-pannel .friends-outer").style.display = "none";
//     teamsPannel.style.top = "65vh";
//     createTeamBtn.style.display = "none";
//     startTripBtn.style.display = "block";
//     inviteTripBtn.style.display = "none";
//     mainPannel.style.display = "none";
//     teamsPannel.style.display = "flex";
//     dropDownMain.style.display = "block";
//     pullUpMain.style.display = "none";
//     createTeamBtn.style.display = "none";
//     startTripBtn.style.display = "none";
//     inviteTripBtn.style.display = "none";
//     joinTripBtn.style.display = "block";
// };

// const teamOffline = () => {
//     let//
//     teamCreateResponse = document.querySelector(".team-join-response"),
//     content = document.querySelector(".team-join-response .content");
//     content.textContent = `${this.textContent}的擁有者，尚未啟程`;
//     teamCreateResponse.style.display = "block";
//     mainPannel.style.top = "vh";
//     dropDownMain.style.display = "none";
//     pullUpMain.style.display = "block";
// };

socket.on("update_team_status", (team_online_list) => {

    // update join team list when friend gets online
    let joinTeamitems = document.querySelectorAll(".main-pannel .join-list .item");
    for ( let item of joinTeamitems) {
        // removing all click event as resetting

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
                DOMElements.teamsPannel.style.top = "65vh";
                DOMElements.createTeamBtn.style.display = "none";
                DOMElements.startTripBtn.style.display = "block";
                DOMElements.inviteTripBtn.style.display = "none";
                DOMElements.mainPannel.style.display = "none";
                DOMElements.teamsPannel.style.display = "flex";
                DOMElements.dropDownMain.style.display = "block";
                DOMElements.pullUpMain.style.display = "none";
                DOMElements.createTeamBtn.style.display = "none";
                DOMElements.startTripBtn.style.display = "none";
                DOMElements.inviteTripBtn.style.display = "none";
                DOMElements.joinTripBtn.style.display = "block";
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
                DOMElements.mainPannel.style.top = "65vh";
                DOMElements.dropDownMain.style.display = "none";
                DOMElements.pullUpMain.style.display = "block";
            })
        }
    }
})

// Close team-join-response when click ok
let joinOkBtn = document.querySelector(".team-join-response button");
joinOkBtn.addEventListener("click", () => {
    let//
    teamCreateResponse = document.querySelector(".team-join-response"),
    content = document.querySelector(".team-join-response .content");
    teamCreateResponse.style.display = "none";
    content.textContent = ``;
})


// Emit event "join_team_request" to server
let joinRequestBtn = document.querySelector(".join-trip-btn");
joinRequestBtn.addEventListener("click", () => {
    let team_id = document.querySelector(".teams-pannel .pannel-title").getAttribute("id");
    let requesterData = {
        "user_sid": window.sessionStorage.getItem("sid"),
        "user_id": window.sessionStorage.getItem("user_id"),
        "username": window.sessionStorage.getItem("username"),
        "team_id": team_id
    };
    socket.emit("join_team_request", requesterData);
})



// (Team owner) Listener for receiving event "join_team_reqeust" from server
socket.on("join_team_request", (data) => {
    // show prompt of the request for joining team
    let//
    team_join_request = document.querySelector(".team-join-request"),
    from = document.querySelector(".team-join-request .from"),
    content = document.querySelector(".team-join-request .content");

    content.setAttribute("id", data["user_id"]);
    from.setAttribute("id", data["user_sid"]);
    from.textContent = data["username"];
    content.textContent = `來自 ${data.username} 的入隊申請`;
    team_join_request.style.display = "block";
})


// Yes or No response to join team requeset
// if yes
let requestYesBtn = document.querySelector(".team-join-request .yes");
requestYesBtn.addEventListener("click", () => {
    // create a new marker color for new partner
    let//
    requester_id = document.querySelector(".team-join-request .content").getAttribute("id"),
    requester_name = document.querySelector(".team-join-request .from").textContent,
    requester_sid = document.querySelector(".team-join-request .from").getAttribute("id"),
    randomColor = `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`;

    partnersColor[requester_id] = {
        username: requester_name,
        color: randomColor
    };
    
    // emit event "enter_team" to server to initialize 
    let acceptRequestData = {
        accept: true,
        requester_sid: requester_sid,
        partners_color: partnersColor
    };
    socket.emit("accept_team_request", acceptRequestData);

    // *************************
    // recover team prompt
    let//
    prompt = document.querySelector(".team-join-request"),
    content = document.querySelector(".team-join-request .content"),
    from = document.querySelector(".team-join-request .from");

    content.textContent = "";
    content.setAttribute("id","");
    from.textContent = "";
    from.setAttribute("id","");
    prompt.style.display = "none";
})

// if no
let requesetNoBtn = document.querySelector(".team-join-request .no");
requesetNoBtn.addEventListener("click", () => {

    // *************************
    // recover team prompt
    let//
    prompt = document.querySelector(".team-join-request"),
    content = document.querySelector(".team-join-request .content"),
    from = document.querySelector(".team-join-request .from");

    content.textContent = "";
    content.setAttribute("id","");
    from.textContent = "";
    from.setAttribute("id","");
    prompt.style.display = "none";
})


// (Requester) Listener for receiving event "accept_team_request" from team owner
socket.on("accept_team_request", (data) => {
    // cache sender_info
    team_sender_info_cache = data;

    // Organize data emitted to listener "enter_team" on server
    let joinTeamData = {
        accept: true,
        enter_type: "join",
        team_id: data["team_id"]
    };

    window.sessionStorage.setItem("team_id", data["team_id"])
    socket.emit("enter_team", joinTeamData);

    // switch to tracking pannel
    switchPannel(DOMElements.trackingPannel, DOMElements.settingOnTracking);

    // create partner information in partners-list
    // 1. only show team owner and partner it self
    // 2. update other partners when they join in
    let partnersList = document.querySelector(".tracking-pannel .partners-list");
    for ( let id in team_sender_info_cache["partners_color"] ) {

        // create leader item first
        if ( id*1 === team_sender_info_cache["user_id"]*1 ) {
            appendPartner(id, partnersList, team_sender_info_cache["partners_color"]);
        }

        // then, create partner self 
        if ( id*1 === window.sessionStorage.getItem("user_id")*1 ) {
            appendPartner(id, partnersList, team_sender_info_cache["partners_color"]);
        }
    }
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
