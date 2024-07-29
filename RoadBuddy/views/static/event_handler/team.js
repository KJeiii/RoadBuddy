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
socket.on("leave_team", (leavingUser) => {
    // remove leaving partner's marker and information in the partner list
    const isNotMe = leavingUser.sid !== socket.id;
    if (isNotMe){
        mapInfo.RemoveMarker(leavingUser.sid);
        RemoveUserFromPartnerList(leavingUser["user_id"])
    }
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
socket.on("join_team_request", (applicant) => {
    // show prompt of the request for joining team
    ControlTeamMsgBox(".team-join-request", "block", {
        applicantID: applicant.userID,
        applicantSID: applicant.userSID,
        applicantUsername: applicant.username
    });
    team_applicants_cache[applicant.userID] = {...applicant};
})

// (Requester) Listener for receiving event "accept_team_request" from team owner
socket.on("accept_team_request", (acceptApplicationResponse) => {
    // cache sender_info
    team_sender_info_cache = acceptApplicationResponse;   
    const {team_id:teamID, partners} = acceptApplicationResponse;

    // Organize data emitted to listener "enter_team" on server
    EmitEnterTeamEvent(true, "join", teamID, myCoord);
    ManipulateSessionStorage("set", {team_id: teamID});

    // switch to tracking pannel
    SwitchPannel("tracking");

    // append partners icon and markers
    const//
        {user_id:userID, username, image_url:imageUrl} = window.sessionStorage,
        partnerList = document.querySelector(".tracking-pannel .partner-list");
    AppendUserInPartnerList(userID, username, imageUrl, partnerList);
    for (const partner in partners){
        const isNotMe = partner !== socket.id;
        if (isNotMe){
            console.log(partner);
            AppendUserInPartnerList(partners[partner].user_id, partners[partner].username, partners[partner].image_url, partnerList);
            mapInfo.CreateMarker(partner, partners[partner].image_url, partners[partner].coordination);
        }
    }
})