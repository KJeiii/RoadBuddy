import { ClearList, RenderList, RenderOnlineStatus, SwitchPannel, ControlTeamMsgBox
} from "../Utils/GeneralControl.js";
import { appendPartner, removePartner } from "../Utils/ManagePartner.js";
import { AddTeamClickEvent, AddTeamHoverEvent } from "../Utils/TeamEvent.js";
import { ManipulateSessionStorage } from "../Utils/ManageUser.js";
import { EmitEnterTeamEvent } from "../Utils/ManageTeam.js";

// ----- listener for receiving event "team_invite" from server -----
socket.on("team_invite", (data) => {
    team_sender_info_cache = data

    // prompt to ask willness
    ControlTeamMsgBox(".team-invite-prompt", "block", {leaderName: data.username})
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
    const positionData = {
        ...window.sessionStorage,
        coord : {
            latitude: initialCoord.latitude,
            longitude: initialCoord.longitude
        }
    };
    delete positionData["friendList"];
    socket.emit("position", positionData);
})



//  ----- add new partners if they join -----
socket.on("add_partner", (user_id) => {
    let partnerList = document.querySelector(".tracking-pannel .partner-list");

    // Team owner updates it's partner list
    if ( team_sender_info_cache === undefined ) {
        for ( let id in partnersColor) {
            if ( id*1 === user_id*1 ) {
                appendPartner(id, partnerList, partnersColor);
            }
        }
        return
    }

    // Partners in team update their partner list
    for ( let id in team_sender_info_cache.partners_color) {
        if ( id*1 === user_id*1 && id*1 !== team_sender_info_cache.user_id*1 && id*1 !== window.sessionStorage.getItem("user_id")*1) {
            appendPartner(id, partnerList, team_sender_info_cache["partners_color"]);
        }
    }
})

// ----- Listener for receiving event "leave_team" from server -----
socket.on("leave_team", (data) => {
    let leavingPartnerSid = data.sid;
    
    // as a leaving partner:
    if ( socket.id === leavingPartnerSid ) {

        // 1. remove team_id in browser session
        ManipulateSessionStorage("remove", "team_id");

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
    if (socket.id === data["leader_sid"]) {delete partnersColor[data["user_id"]*1]}
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

socket.on("update_team_status", (teamArray) => {
    // update global var
    onlineTeamArray = teamArray;

    ClearList(".join-list");
    RenderList(".join-list", joinedTeamArray);
    RenderOnlineStatus(".join-list .item", onlineTeamArray);
    AddTeamClickEvent(".join-list .item", onlineTeamArray);
    AddTeamHoverEvent(".join-list .item");
})

// (Team owner) Listener for receiving event "join_team_reqeust" from server
socket.on("join_team_request", (data) => {
    // show prompt of the request for joining team
    ControlTeamMsgBox(".team-join-request", "block", {
        requesterID: data["user_id"],
        requesterSID: data["user_sid"],
        requesterName:data["username"]
    });
})

// (Requester) Listener for receiving event "accept_team_request" from team owner
socket.on("accept_team_request", (data) => {
    // cache sender_info
    team_sender_info_cache = data;

    // Organize data emitted to listener "enter_team" on server
    EmitEnterTeamEvent(true, "join", data["team_id"]);
    ManipulateSessionStorage("set", {team_id: data["team_id"]});

    // switch to tracking pannel
    SwitchPannel("tracking");

    // create partner information in partner-list
    // 1. only show team owner and partner it self
    // 2. update other partners when they join in
    let partnerList = document.querySelector(".tracking-pannel .partner-list");
    for ( let id in team_sender_info_cache["partners_color"] ) {

        // create leader item first
        if ( id*1 === team_sender_info_cache["user_id"]*1 ) {
            appendPartner(id, partnerList, team_sender_info_cache["partners_color"]);
        }

        // then, create partner self 
        if ( id*1 === window.sessionStorage.getItem("user_id")*1 ) {
            appendPartner(id, partnerList, team_sender_info_cache["partners_color"]);
        }
    }
})