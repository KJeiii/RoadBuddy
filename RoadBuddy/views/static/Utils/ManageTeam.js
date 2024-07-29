export async function SearchTeams(userID, teamType){
    try {
        let response = await fetch("/api/team", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user_id: userID, team_type: teamType})
        });
        
        let result = await response.json();
        return {
            createdTeamList: result.data.created_team_list,
            joinedTeamList: result.data.joined_team_list
        }
    }
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
        })
    });

    let result = await response.json();
    if (result.error) {
        searchInput.value = "";
        searchInput.setAttribute("placeholder", "隊伍名稱已被使用，請輸入其他名稱");
        throw new Error("隊伍名稱已被使用，請輸入其他名稱")
    }
    return result
}

export function EmitEnterTeamEvent(accept, enterType, teamID, coordination){
    const enterTeamInfo = {
        accept: accept,
        enter_type: enterType,
        team_id: teamID,
        coordination: coordination
    };
    socket.emit("enter_team", enterTeamInfo)
}

export function EmitInviteTeamEvent(senderSID, teamID, myCoordination, friendIDsToAddArray, partnerColorObject){
    const invitation = {
        senderSid: senderSID,
        team_id: teamID,
        senderCoordination: myCoordination,
        receiver_info: {
            receiver_id: friendIDsToAddArray,
            receiver_color: partnerColorObject            
        }
    };
    socket.emit("team_invite", invitation)
}

export function EmitJoinTeamRequestEvent(userSID, userID, username, teamID){
    console.log(userSID, userID, username, teamID)
    const requesterData = {
        "user_sid": userSID,
        "user_id": userID,
        "username": username,
        "team_id": teamID
    };
    socket.emit("join_team_request", requesterData);
}

export function EmitAcceptTeamRequestEvent(accept, requestSID, partnersColorObject){
    let acceptRequestData = {
        accept: accept,
        requester_sid: requestSID,
        partners_color: partnersColorObject
    };
    socket.emit("accept_team_request", acceptRequestData);
}

export function EmitLeaveTeamEvent(userSID, userID, teamID, leaderSID){
    const leavingUser = {
        sid: userSID,
        user_id: userID,
        team_id: teamID,
        leader_sid: leaderSID
    };
    socket.emit("leave_team", leavingUser);
}