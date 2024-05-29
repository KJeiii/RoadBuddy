// seperate to 3 parts:
// 1. search created team 
// 2. search joined team
// 3. render team list >> move to GeneralControl.js

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

export function EmitEnterTeamEvent(accept, enterType, teamID){
    const enterTeamInfo = {
        accept: accept,
        enter_type: enterType,
        team_id: teamID
    };
    socket.emit("enter_team", enterTeamInfo)
}

export function EmitInviteTeamEvent(senderSID, teamID,friendIDsToAddArray, partnerColorObject){
    const inviteTeamInfo = {
        sender_sid: senderSID,
        team_id: teamID,
        receiver_info: {
            receiver_id: friendIDsToAddArray,
            receiver_color: partnerColorObject            
        }
    };
    socket.emit("team_invite", inviteTeamInfo)
}

