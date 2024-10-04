import { ClearList, RenderList, RenderOnlineStatus, SwitchPannel, ControlTeamMsgBox
} from "../Utils/GeneralControl.js";
import { AppendUserInPartnerList, CreatePartner, RemoveUserFromPartnerList } from "../Utils/ManagePartner.js";
import { AddTeamClickEvent, AddTeamHoverEvent } from "../Utils/TeamEvent.js";
import { ManipulateSessionStorage } from "../Utils/ManageUser.js";
import { EmitEnterTeamEvent } from "../Utils/ManageTeam.js";
import { map, teamApplication, teams } from "../Utils/AppClass.js";

// ----- listener for receiving event "team_invite" from server -----
socket.on("team_invite", (data) => {
    team_sender_info_cache = data
    // prompt to ask willness
    ControlTeamMsgBox(".team-invite-prompt", "block", {leaderName: data.username})
})

//  ----- add new partners if they join -----
socket.on("add_partner", (partner) => { 
    const//
        {user_id:userID, username, image_url:imageUrl, coordination, icon_color: iconColor} = partner,
        isNotMe = Number(userID) !== Number(window.sessionStorage.getItem("user_id"));
    if (isNotMe){
        CreatePartner(userID, username, imageUrl, iconColor, coordination, 
            document.querySelector(".tracking-pannel .partner-list"));
    }
})

// ----- Listener for receiving event "leave_team" from server -----
socket.on("leave_team", (leavingUser) => {
    // remove leaving partner's marker and information in the partner list
    const isNotMe = Number(leavingUser.user_id) !== Number(sessionStorage.getItem("user_id"));
    if (isNotMe){
        map.RemoveMarker(leavingUser.user_id);
        RemoveUserFromPartnerList(leavingUser["user_id"])
    }
})

socket.on("update_team_status", (teamArray) => {
    // update joinTeamArray
    teams.UpdateOnlineTeam(teamArray);
    ClearList(".join-list");
    RenderList(".join-list", teams.GetJoinedTeams());
    RenderOnlineStatus(".join-list .item", teams.GetOnlineTeams());
    AddTeamClickEvent(".join-list .item", ...teams.GetOnlineTeams());
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
    teamApplication.AppendRequestObject(applicant, applicant.userID);
})

// (Requester) Listener for receiving event "accept_team_request" from team owner
socket.on("accept_team_request", (acceptApplicationResponse) => {  
    const {team_id:teamID, partners} = acceptApplicationResponse;

    // Organize data emitted to listener "enter_team" on server
    const {user_id: userID, username, image_url: imageUrl, iconColor} = window.sessionStorage;
    EmitEnterTeamEvent(true, "join", teamID, imageUrl, iconColor);
    ManipulateSessionStorage("set", {team_id: teamID});

    // switch to tracking pannel
    SwitchPannel("tracking");

    // append partners icon and markers
    const partnerList = document.querySelector(".tracking-pannel .partner-list");
    AppendUserInPartnerList(userID, username, imageUrl, partnerList);
    for (const partner in partners){
        const isNotMe = Number(partners[partner].user_id) !== Number(userID);
        if (isNotMe){
            const {user_id:userID, username, image_url:imageUrl, coordination, icon_color:iconColor} = partners[partner];
            CreatePartner(userID, username, imageUrl, iconColor, coordination, partnerList);
        }
    }
})