export async function SearchTeams(userID, teamType){
    try {
        let//
            response = await fetch(`/api/team?userID=${userID}&teamType=${teamType}`),
            result = await response.json();
        return {
            createdTeamList: result.data.created_team_list,
            joinedTeamList: result.data.joined_team_list
        }}
    catch(error){
        console.log(error);
        throw(new Error(`Search created teams failed (ManageTeams.js): ${error}`))
    }
}

export async function CreateNewTeam(userID, teamName){
    let response = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            team_name: teamName,
            user_id: userID
        })});

    let result = await response.json();
    if (result.error) {
        searchInput.value = "";
        searchInput.setAttribute("placeholder", "The name is used by other user.");
        throw new Error("The name is used by other user.")
    }
    return result
}

export function EmitEnterTeamEvent(accept, enterType, teamID, imageUrl, iconColor, ...coordination){
    const initialCoordination = (coordination.length !== 0) ? 
                                coordination[0] : 
                                {
                                    latitude: Number(sessionStorage.getItem("initialLatitude")),
                                    longitude: Number(sessionStorage.getItem("initialLongitude"))
                                };
    const enterTeamInfo = {
        accept: accept,
        enter_type: enterType,
        team_id: teamID,
        imageUrl: imageUrl,
        iconColor: iconColor,
        coordination: initialCoordination
    };
    socket.emit("enter_team", enterTeamInfo)
}

export function EmitInviteTeamEvent(senderSID, teamID, senderImageUrl, senderIconColor, friendIDsToInviteArray, ...senderCoordination){
    const initialCoordination = (senderCoordination.length !== 0) ?
                                senderCoordination[0] :
                                {
                                    latitude: Number(sessionStorage.getItem("initialLatitude")),
                                    longitude: Number(sessionStorage.getItem("initialLongitude"))
                                };
    const invitation = {
        senderSID: senderSID,
        teamID: teamID,
        senderImageUrl: senderImageUrl,
        senderIconColor: senderIconColor,
        senderCoordination: initialCoordination,
        friendIDsToInvite: friendIDsToInviteArray            
    };
    socket.emit("team_invite", invitation)
}

export function EmitJoinTeamRequestEvent(userSID, userID, username, imageUrl, iconColor, teamID, ...coordination){
    const initialCoordination = (coordination.length !== 0) ?
                                coordination[0] :
                                {
                                    latitude: Number(sessionStorage.getItem("initialLatitude")),
                                    longitude: Number(sessionStorage.getItem("initialLongitude"))
                                };
    const applicant = {
        userSID: userSID,
        userID: userID,
        username: username,
        imageUrl: imageUrl,
        iconColor: iconColor,
        coordination: initialCoordination,
        teamID: teamID
    };
    socket.emit("join_team_request", applicant);
}

export function EmitAcceptTeamRequestEvent(accept, applicantSID){
    let acceptApplicationData = {
        accept: accept,
        applicantSID: applicantSID,
    };
    socket.emit("accept_team_request", acceptApplicationData);
}

export function EmitLeaveTeamEvent(userID, teamID){
    const leavingUser = {user_id: userID, team_id: teamID};
    socket.emit("leave_team", leavingUser);
}