import { ClearList, RenderList, RenderOnlineStatus, SwitchPannel, ControlTeamMsgBox
} from "../Utils/GeneralControl.js";
import { AppendUserInPartnerList, RemoveUserFromPartnerList } from "../Utils/ManagePartner.js";
import { AddTeamClickEvent, AddTeamHoverEvent } from "../Utils/TeamEvent.js";
import { ManipulateSessionStorage } from "../Utils/ManageUser.js";
import { EmitEnterTeamEvent } from "../Utils/ManageTeam.js";
import { mapInfo } from "../main.js";

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
    const positionData = {...window.sessionStorage, coordination: myCoord};
    delete positionData["friendList"];
    socket.emit("position", positionData);
})

//  ----- add new partners if they join -----
socket.on("add_partner", (partner) => { 
    const//
        {user_id:userID, sid, username, image_url:imageUrl, coordination} = partner,
        notMyself = userID !== Number(window.sessionStorage.getItem("user_id"));
    if (notMyself){
        mapInfo.CreateMarker(sid, imageUrl, coordination);
        AppendUserInPartnerList(userID, username, imageUrl, document.querySelector(".tracking-pannel .partner-list"));
    }
})

// ----- Listener for receiving event "leave_team" from server -----
socket.on("leave_team", (data) => {
    // remove leaving partner's marker and information in the partner list
    mapInfo.RemoveMarker(data.sid);
    RemoveUserFromPartnerList(data["user_id"])
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
            AppendUserInPartnerList(id, partnerList, team_sender_info_cache["partners_color"]);
        }

        // then, create partner self 
        if ( id*1 === window.sessionStorage.getItem("user_id")*1 ) {
            AppendUserInPartnerList(id, partnerList, team_sender_info_cache["partners_color"]);
        }
    }
})