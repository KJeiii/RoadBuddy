import * as DOMElements from "./DOMElements.js";
import { SearchNewFriends, RenderSearchResult, SearchOldFriends, CheckRelationship, 
    SendFriendRequest, EmitFriendRequestResultEvent, UpdateFriends
} from "./ManageFriend.js";
import { ControlFriendMsgBox, ClearList, RenderList, SwitchSettingBtn, SwitchPullAndDropBtn, 
    ShowPannelContent, SwitchMenuToggle, onWhichPannelContent, SwitchPannel, SwitchMenuTitle, 
    isPannelPulledUp, ControlTeamMsgBox, SwitchPannelOnAndOff, RenderOnlineStatus, ReRenderList, 
    isInputValuesConsistent, ClearErrorMessage, VerifyInputValue, isInputFilledIn, isInputValuesUnique,
    RenderResponse, RenderTrackingMode, GetSelectedUsersFromPannel } from "./GeneralControl.js";
import { CreateNewTeam, SearchTeams, EmitEnterTeamEvent, EmitInviteTeamEvent, EmitJoinTeamRequestEvent, 
    EmitAcceptTeamRequestEvent, EmitLeaveTeamEvent } from "./ManageTeam.js";
import { AddTeamClickEvent, AddTeamHoverEvent } from "./TeamEvent.js";
import { ChangeIconColor, ManipulateSessionStorage, RenderAvatar, 
    RenderUsername, CollectInformationToUpdate, UpdateUserInformation, UpdatePassword, VerifyPasswordInputs } from "./ManageUser.js";
import { AppendUserInPartnerList, BuildPartnership, CreatePartner} from "./ManagePartner.js";
import { makeFriendInvitation, map, messages, onlineUsers, teamApplication, teamInvitation, teams} from "./AppClass.js";
import { RenderMessageBtn, SearchMessage } from "./ManageMessage.js";
import { ClearInputValues, PreviewAvatar, SwitchAvatarUndoBtn, SwitchChangePasswordPrompt } from "./ManageConfigure.js";


export const AllEvents = [
    AddEventsToSetting, AddEventsToSwitchPannelContent, AddEventsToFriend,
    AddEventsToTeam, AddEventsToPullAndDrop, AddEventsToClose, AddEventsToUser
]


export function AddEventsToSetting() {
    // ----- toggle down setting  -----
    DOMElements.settingBtn.addEventListener("click", ()=>{SwitchSettingBtn()})

    // ----- logout button -----
    DOMElements.logout.addEventListener("click", () => {
        window.localStorage.removeItem("token");
        ManipulateSessionStorage("clear");
        window.location.replace("/member");
    })

    // ----- message button -----
    DOMElements.message.addEventListener("click", ()=>{
        document.querySelector(".message-pannel").style.display = "flex";
        SwitchSettingBtn({"all": "none"});
    });

    document.querySelector(".message-pannel .close").addEventListener("click", ()=>{
        DOMElements.message.style.backgroundColor = "";
    })

    // ------ configure button -----
    // show configure pannel
    const configureBtn = document.querySelector("div.configure");
    configureBtn.addEventListener("click", ()=>{
        document.querySelector(".configure-pannel").style.display = "flex";
        SwitchSettingBtn({"all": "none"});
    })

    // preview avatar
    const avatarInput = document.querySelector("input#avatar");
    avatarInput.addEventListener("change", ()=>{
        PreviewAvatar(
            document.querySelector("input#avatar").files[0],
            document.querySelector("div.configure-outer div.image")
        );
        SwitchAvatarUndoBtn("div.configure-outer div.undo");
    });

    // Be albe to modify username
    const modifyButton = document.querySelector("img.modify");
    modifyButton.addEventListener("click", ()=>{
        const disabledStatus = document.querySelector("input#username-to-update").disabled;
        document.querySelector("input#username-to-update").disabled = !disabledStatus;
    })

    // click close to initialize update-response prompt
    const updateResponseCloseBtn = document.querySelector(".configure-response .close");
    updateResponseCloseBtn.addEventListener("click", ()=>{
        RenderResponse(".configure-response", 2);
        document.querySelector(".configure-response").style.display = "none";
        SwitchAvatarUndoBtn("div.configure-outer div.undo");
    });

    // click close to initialzie update-pannel input value
    const configPannelCloseBtn = document.querySelector(".configure-pannel .close");
    configPannelCloseBtn.addEventListener("click", ()=>{
        document.querySelector("input#avatar").value = "";
        document.querySelector(".configure-outer .image").style.backgroundImage = `url(${window.sessionStorage.getItem("image_url")})`;
        document.querySelector(".configure-pannel input#username-to-update").value = window.sessionStorage.getItem("username");
        SwitchAvatarUndoBtn("div.configure-outer div.undo");
    })

    // undo file seleted
    const undo = document.querySelector(".configure-outer .image .undo");
    undo.addEventListener("click", ()=>{
        document.querySelector(".configure-outer .image").style.backgroundImage = `url(${window.sessionStorage.getItem("image_url")})`;
        document.querySelector("input#avatar").value = "";
        SwitchAvatarUndoBtn("div.configure-outer div.undo");
    })

    // update user information
    const confirmUpdateBasicBtn = document.querySelector("button.update-basic");
    confirmUpdateBasicBtn.addEventListener("click", ()=>{
        CollectInformationToUpdate()
            .then((dataToUpdate)=>{
                document.querySelector(".configure-response").style.display = "flex";
                document.querySelector(".configure-pannel").style.display = "none";
                UpdateUserInformation(dataToUpdate)
                    .then((updateResponse)=>{
                        // close configure pannel
                        SwitchPannel("main");
                        // pop up prompt to show update success
                        RenderResponse(".configure-response", updateResponse.responseCode);
        
                        // re-render username and avatar in the configure pannel and main pannel
                        if (updateResponse.ok && updateResponse.responseCode === 1 ){
                            if (updateResponse.username !== window.sessionStorage.getItem("username")){
                                RenderUsername(updateResponse.username);
                                ManipulateSessionStorage("set", {username: updateResponse.username})}
                            if (updateResponse.image_url !== ""){
                                RenderAvatar(updateResponse.image_url);
                                map.UpdateMarkerImage(updateResponse.image_url);
                                ManipulateSessionStorage("set", {image_url: updateResponse.image_url})}
                        }
                        //remove the value(file) of input#avatar
                        document.querySelector("input#avatar").value = "";
                        SwitchAvatarUndoBtn("div.configure-outer div.undo");
                    })
                    .catch((updateResponse)=>{
                        RenderResponse(".configure-response", updateResponse.responseCode);
                        console.log(updateResponse.message)
                    })
            })
            .catch((error) => {
                console.log(error);
                RenderResponse(".configure-response", error.responseCode);
            })
    })

    // click change password and show prompt
    document.querySelector("div.configure-pannel button.update-password").addEventListener("click", ()=>{
        document.querySelector("div.configure-pannel").style.display = "none";
        SwitchChangePasswordPrompt();
    });

    // click cancel to go back to configure pannel
    document.querySelector("div.update-password button.cancel").addEventListener("click", ()=>{
        document.querySelector("div.configure-pannel").style.display = "flex";
        SwitchChangePasswordPrompt();
        ClearInputValues(...document.querySelectorAll("div.update-password input"));
        ClearErrorMessage(
            document.querySelector("div.update-password div.update-password__old-password__title"),
            document.querySelector("div.update-password div.update-password__new-password__title"),
            document.querySelector("div.update-password div.update-password__confirm-password__title")
        )
    })

    // check password input values when they are changed
    const [oldPwdInput, newPwdInput, confirmPwdInput] = document.querySelectorAll("div.update-password input");
    oldPwdInput.addEventListener("change", function(){VerifyInputValue(this, isInputFilledIn)});
    newPwdInput.addEventListener("change", function(){VerifyInputValue(this, isInputValuesUnique, oldPwdInput)});
    confirmPwdInput.addEventListener("change", function(){VerifyInputValue(this, isInputValuesConsistent, newPwdInput)});

    // click change password button to update
    document.querySelector("div.update-password button.update").addEventListener("click", ()=>{
        VerifyPasswordInputs()
            .then(dataToUpdate => {
                SwitchChangePasswordPrompt();
                SwitchPannel("main");
                document.querySelector(".configure-response").style.display = "flex";
                UpdatePassword(dataToUpdate.oldPassword, dataToUpdate.newPassword, localStorage.getItem("token"))
                    .then((updateResponse) => {
                        RenderResponse(".configure-response", updateResponse.responseCode);
                        ClearInputValues(...document.querySelectorAll("div.update-password input"));
                    })
                    .catch((error) => {
                        RenderResponse(".configure-response", error.responseCode);
                        ClearInputValues(...document.querySelectorAll("div.update-password input"));
                    })
            })
            .catch((error) => {console.log(error)})
    })

    // ----- tracking mode prompt
    // show prompt
    document.querySelector("div.mode").addEventListener("click", ()=>{
        document.querySelector(".mode-prompt").style.display = "block";
        SwitchSettingBtn({"all": "none"});
    })

    // render tracking mode on tracking mode prompt
    document.querySelector("input#mode").addEventListener("click", ()=>{
        RenderTrackingMode();
        const isRealtimeMode = document.querySelector("input#mode").checked;
        if (isRealtimeMode){map.TrackRealtimePostion()}
        else{map.ChangePositionRandomly()}
    });
}


export function AddEventsToPullAndDrop() {
    // ----- pull up and drop down main pannel and tracking pannel ------
    const btns = [
        ...document.querySelectorAll(".pull-up"), 
        ...document.querySelectorAll(".drop-down")];

    btns.forEach((btn)=>{
        btn.addEventListener("click", function(){
            const// 
                parentPannelCssSelector = this.parentElement.getAttribute("class"),
                isPulledUp = isPannelPulledUp(`.${parentPannelCssSelector}`),
                pannelAndContent = onWhichPannelContent();
            SwitchPullAndDropBtn(`.${parentPannelCssSelector}`);
            SwitchPannelOnAndOff(`.${parentPannelCssSelector}`);
            ShowPannelContent(`.${parentPannelCssSelector}`, pannelAndContent.content, !isPulledUp)
        })}
    );
}

export function AddEventsToSwitchPannelContent() {
    // ----- switch menu -----
    DOMElements.toggle.addEventListener("click", SwitchMenuToggle)

    // ----- switch content ----
    DOMElements.menuFriend.addEventListener("click", function(){
        const//
            toContent = this.getAttribute("class").split("-")[2],
            toShowUp = isPannelPulledUp(".main-pannel");
        SwitchMenuTitle(toContent);
        ShowPannelContent(".main-pannel", toContent, toShowUp);

        // switch add button
        DOMElements.addTeam.style.display = "none";
        DOMElements.addFriend.style.display = "block";

        // turn off menu
        DOMElements.menuList.style.display = "none";
        DOMElements.menu.style.border = "none";
    })

    DOMElements.menuTeam.addEventListener("click", function(){
        const//
            toContent = this.getAttribute("class").split("-")[2],
            toShowUp = isPannelPulledUp(".main-pannel");
        SwitchMenuTitle(toContent);
        ShowPannelContent(".main-pannel", toContent, toShowUp);

        // switch add button
        DOMElements.addTeam.style.display = "block";
        DOMElements.addFriend.style.display = "none";  

        // turn off menu
        DOMElements.menuList.style.display = "none";
        DOMElements.menu.style.border = "none";
    })
}

export function AddEventsToFriend() {
    // ----- switch to add friend page-----
    DOMElements.addFriend.addEventListener("click", () => {SwitchPannel("friend")});

    // ----- search username-----
    DOMElements.searchIcon.addEventListener("click", () => {
        let searchInput = document.querySelector("input[name=search-friend]");
        searchInput.setAttribute("placeholder", "Friend's name");
        while (DOMElements.searchList.hasChildNodes()) {
            DOMElements.searchList.removeChild(DOMElements.searchList.lastChild)
        }
        if (searchInput.value === "") {
            searchInput.setAttribute("placeholder", "Enter friend's name");
            return
        }
        let username = document.querySelector("input[name=search-friend]").value;
        SearchNewFriends(username)
            .then(newfriendList => RenderSearchResult(newfriendList))
            .catch(error => console.log(error))
    });

    // --- send add friend request ---
    DOMElements.addFriendBtn.addEventListener("click", () => {
        const//     
            selectedFriends = GetSelectedUsersFromPannel(".friend-pannel"),
            selectedFriedIDs = selectedFriends.map((friend) => friend.id);

        //  response if no ckeckbox is checked
        if (selectedFriends.length === 0) {
            ControlFriendMsgBox(".friend-request", "block",
                {
                    selectedFriendIDs: selectedFriedIDs,
                    repetitionIDs: [],
                    oldFriendsList: []
                })
            return
        }

        // update information for following execution: onlineUsers and messages
        const userID = Number(window.sessionStorage.getItem("user_id")); 
        onlineUsers.EmitSyncOnlineUserEvent();
        SearchMessage(userID)
            .then((msgs)=>{msgs.forEach(message => messages.UpdateInfo(message))})
            .catch((error) => console.log(error))
        
        // sending requests
        SearchOldFriends(userID)
            .then((oldFriendsList) => {
                let { repetitionIDs, newFriendIDs } = CheckRelationship(selectedFriedIDs, oldFriendsList);
                SendFriendRequest(repetitionIDs, newFriendIDs);
                ControlFriendMsgBox(".friend-request", "block",
                    {
                        selectedFriendIDs: selectedFriedIDs,
                        repetitionIDs: repetitionIDs,
                        oldFriendsList: oldFriendsList
                    })
            })
            .catch(error => console.log(error))
    });

    // --- clear response content and disappear ---
    DOMElements.friendRequestBtn.addEventListener("click", () => {ControlFriendMsgBox(".friend-request", "none")});

    // --- Acceptance of friend request ---
    DOMElements.friendYesBtn.addEventListener("click", () => {
        // recover friend prompt
        ControlFriendMsgBox(".friend-prompt", "none")

        // receiver fetch api to add friend
        const//
            {user_id, username} = window.sessionStorage,
            senderID = Number(document.querySelector("div.friend-prompt div.content").getAttribute("id"));
        UpdateFriends(Number(user_id), {
            senderID: makeFriendInvitation.GetValue(senderID, "user_id"),
            senderName: makeFriendInvitation.GetValue(senderID, "username"),
            receiverID: Number(user_id),
            receiverName: username
        });
        makeFriendInvitation.DeleteObject(senderID);
    })

    // if reject request
    let friendNoBtn = document.querySelector(".friend-prompt .no");
    friendNoBtn.addEventListener("click", () => {
        ControlFriendMsgBox(".friend-prompt", "none")

        // feedback result to sender
        const//
            {user_id, username} = window.sessionStorage,
            senderID = Number(document.querySelector("div.friend-prompt div.content").getAttribute("id"));
        EmitFriendRequestResultEvent(false, {
                senderID: makeFriendInvitation.GetValue(senderID, "user_id"),
                senderName: makeFriendInvitation.GetValue(senderID, "username"),
                receiverID: user_id,
                receiverName: username
        });
        makeFriendInvitation.DeleteObject(senderID);
    })

    // confirm frined response
    let friendOkBtn = document.querySelector(".friend-response button");
    friendOkBtn.addEventListener("click", ()=>{ControlFriendMsgBox(".friend-response", "none")})
}

export function AddEventsToTeam() {
    // ----- move to add team page-----
    DOMElements.addTeam.addEventListener("click", ()=>{
        SwitchPannel("team");
        ShowPannelContent(".team-pannel", "create", true);
    });

    // ----- create a new team -----
    DOMElements.createTeamBtn.addEventListener("click", () => {
        let searchInput = document.querySelector("input[name=create-team]");
        searchInput.setAttribute("placeholder", "Team name");

        if (searchInput.value === "") {
            searchInput.setAttribute("placeholder", "Enter team name");
            return
        }
        CreateNewTeam(window.sessionStorage.getItem("user_id"), searchInput.value)
            .then((result)=>{
                SearchTeams(window.sessionStorage.getItem("user_id"), "created")
                    .then((result) => {
                        teams.UpdateCreatedTeam(...result.createdTeamList);
                        ClearList(".create-list");
                        RenderList(".create-list", result.createdTeamList);
                        AddTeamClickEvent(".create-list .item");
                        AddTeamHoverEvent(".create-list .item");})
                    .catch((error) => console.log(
                        `Error in render created team list (room.js):${error}`
                    ));
                
                SwitchPannel("main");
                ControlTeamMsgBox(".team-create-response", "block", {teamName: searchInput.value});
            })
            .catch((error) => { console.log(`Error in creating team : ${error}`) })
    });

    // close team-create-response when click ok
    DOMElements.createOkBtn.addEventListener("click", () => {
        ControlTeamMsgBox(".team-create-response", "none");
    });

    // ----- sender emit invitation to listner "team_invite" on server  -----
    DOMElements.startTripBtn.addEventListener("click", ()=> {
        // cache team_id in frontend
        ManipulateSessionStorage("set", {team_id: document.querySelector(".team-pannel .pannel-title").getAttribute("id")})
        // switch to tracking pannel
        SwitchPannel("tracking");
        SwitchSettingBtn({"all":"none"});
        // Organize data emitted to listener "enter_team" on server
        const//
            selectedFriends = GetSelectedUsersFromPannel(".team-pannel"),
            friendIdsToAdd = selectedFriends.map(friend => friend.id);

        // create owner information in partner-list;others will be created when they join in
        const//
            teamIDToJoin = document.querySelector(".team-pannel .pannel-title").getAttribute("id"),
            {user_id:userID, sid, username, image_url:imageUrl, iconColor} = window.sessionStorage;
        AppendUserInPartnerList(userID, username, imageUrl, document.querySelector(".tracking-pannel .partner-list")); 
        //Issue of not having avatar was tacked in main.js at the beginning of rendering main page
  
        // send request for joining team
        EmitInviteTeamEvent(socket.id, teamIDToJoin, imageUrl, iconColor, friendIdsToAdd);
        EmitEnterTeamEvent(true, "create", teamIDToJoin, imageUrl, iconColor);

        // update team using status to other uses
        socket.emit("update_team_status");
    })

    // ----- invited friends decide whether accept team invitation -----
    // if accept 
    let teamYesBtn = document.querySelector(".team-invite-prompt .yes");
    teamYesBtn.addEventListener("click", () => {
        // switch to tracking pannel
        SwitchPannel("tracking");
        
        // create partner information in partner-list
        // 1. only show team owner and partner itself
        // 2. update other partners when they join in
        const//
            partnerList = document.querySelector(".tracking-pannel .partner-list"),
            {user_id:userID, username, image_url:imageUrl, iconColor} = window.sessionStorage;
        AppendUserInPartnerList(userID, username, imageUrl, partnerList); //own imageUrl has been managed at the beginning of render main page

        const//
            teamID = document.querySelector("div.team-invite-prompt div.content").getAttribute("id"),
            {user_id:leaderID, username: leaderUsername, icon_Color: leaaderIconColor,
            image_url:leaderImageUrl, coordination:leaderCoordination} = teamInvitation.cachedObject[teamID];
        CreatePartner(
            leaderID, leaderUsername, leaderImageUrl, 
            leaaderIconColor, leaderCoordination, partnerList);
 
        // recover team prompt
        ControlTeamMsgBox(".team-invite-prompt", "none");

        // Organize data emitted to listener "enter_team" on server
        EmitEnterTeamEvent(true, "join", teamID, imageUrl, iconColor);
        ManipulateSessionStorage("set", {team_id: teamID});

        // Create partner record in partner table in database
        BuildPartnership(Number(userID), teamID)
            .then((result) => {
                SearchTeams(Number(userID), "joined")
                    .then((result) => {
                        teams.UpdateJoinedTeam(...result.joinedTeamList);
                        ClearList(".join-list");
                        RenderList(".join-list", result.joinedTeamList);
                        RenderOnlineStatus(".join-list .item", teams.GetOnlineTeams());
                        AddTeamClickEvent(".join-list .item", ...teams.GetOnlineTeams());
                        AddTeamHoverEvent(".join-list .item");
                    })})
            .catch((error) => {console.log(`Error in accept team request : ${error}`)});
        teamInvitation.DeleteObject(teamID);
    })

    // if reject
    let teamNoBtn = document.querySelector(".team-invite-prompt .no");
    teamNoBtn.addEventListener("click", () => {
        ControlTeamMsgBox(".team-invite-prompt", "none");
        // Organize data emitted to listener "enter_team" on server
        EmitEnterTeamEvent(false, "join", document.querySelector(".team-pannel .pannel-title").getAttribute("id"));
        teamInvitation.DeleteObject(teamID);
    })

    // ----- confirm team response -----
    let teamOkBtn = document.querySelector(".team-invite-response button");
    teamOkBtn.addEventListener("click", ()=>{ControlTeamMsgBox(".team-invite-response", "none")})

    // ----- emit leave team event to listener "leave_team" on server-----
    DOMElements.leaveTeamBtn.addEventListener("click", ()=> {
        // emit socket event "leave_team"
        const//
            userID = Number(window.sessionStorage.getItem("user_id")),
            teamID = window.sessionStorage.getItem("team_id");
        EmitLeaveTeamEvent(userID, teamID);
        ManipulateSessionStorage("remove", "team_id");

        // switch to mainPannel
        SwitchPannel("main");

        //remove all user in the partner list and just leave own marker on the map
        ClearList(".tracking-pannel .partner-list");
        map.RemoveAllOtherMarkersExcept(userID);

        // re-render message list
        SearchMessage(userID)
            .then((msgs) => {
                msgs.forEach((message) => {messages.UpdateInfo(message)})
                ReRenderList([".message-list"], messages.GetSenderList());
                SwitchSettingBtn({"all": "none"});
                RenderMessageBtn(false);})
            .catch((error) => {console.log(error)})
    })

    // ----- While tracking, invite other frineds -----
    // open team pannel
    let settingInviteBtn = document.querySelector(".setting .invite");
    settingInviteBtn.addEventListener("click", () => {
        SwitchPannel("team");
        ShowPannelContent(".team-pannel", "invite", true);

        let friendItems = document.querySelectorAll(".team-pannel .friend-list input");
        for ( let item of friendItems ) {item.checked = false}
    })

    // send invitation
    DOMElements.inviteTripBtn.addEventListener("click", () => {
        const//
            selectedFriends = GetSelectedUsersFromPannel(".team-pannel"),
            partnerIDsArray = Array(
                ...document.querySelectorAll("div.partner-list div.item")).map(partner => Number(partner.getAttribute("id")));
        if (partnerIDsArray.length > 0){
            const//
                friendIDsToInvite = [],
                {team_id: teamID, iconColor, image_url: imageUrl} = window.sessionStorage;
            selectedFriends.forEach(friend => {
                const notJoinedYet = !partnerIDsArray.includes(friend.id);
                if(notJoinedYet){friendIDsToInvite.push(friend.id)}
            });
            EmitInviteTeamEvent(socket.id, teamID, imageUrl, iconColor, friendIDsToInvite);
        }                
        // close team pannel and go back to tracking pannel
        SwitchPannel("tracking");
    })

    // Close team-join-response when click ok
    let joinOkBtn = document.querySelector(".team-join-response button");
    joinOkBtn.addEventListener("click", () => {
        ControlTeamMsgBox(".team-join-response", "none");
    })

    // Emit event "join_team_request" to server
    let joinRequestBtn = document.querySelector(".join-trip-btn");
    joinRequestBtn.addEventListener("click", () => {
        const// 
            {user_id: userID, username, image_url:imageUrl, iconColor} = window.sessionStorage,
            teamID = document.querySelector(".team-pannel .pannel-title").getAttribute("id");
        EmitJoinTeamRequestEvent(socket.id, userID, username, imageUrl, iconColor, teamID);
        SwitchPannel("main");
    })

    // Yes or No response to join team requeset
    // if yes
    let requestYesBtn = document.querySelector(".team-join-request .yes");
    requestYesBtn.addEventListener("click", () => {
        const applicantID = document.querySelector(".team-join-request .content").getAttribute("id");
        // emit event "enter_team" to server to initialize 
        EmitAcceptTeamRequestEvent(true, teamApplication.GetValue(applicantID, "userSID"));
        // recover team prompt and remove applicant object
        ControlTeamMsgBox(".team-join-request", "none");
        teamApplication.DeleteObject(applicantID);
    })

    // if no
    let requesetNoBtn = document.querySelector(".team-join-request .no");
    requesetNoBtn.addEventListener("click", () => {
        ControlTeamMsgBox(".team-join-request", "none");
        // remove applicant object
        teamApplication.DeleteObject(
            Number(document.querySelector(".team-join-request .content").getAttribute("id"))
        )
    })
}

export function AddEventsToClose() {
    for (let closeBtn of DOMElements.closePannel) {
        closeBtn.addEventListener("click", () => {
            const isTraveling = sessionStorage.getItem("team_id") !== null;
            if(isTraveling){
                SwitchPannel("tracking");
                return
            }
            SwitchPannel("main");
        })
    };
}

export function AddEventsToUser(){
    // change avatar color
    const//
        iconDiv = document.querySelector("div.user-info>div.icon"),
        notUploadingAvatar = !String(window.sessionStorage.getItem("image_url")).includes("https");
    if (notUploadingAvatar) {
        iconDiv.addEventListener("click", ()=>{
            ChangeIconColor(window.sessionStorage.getItem("username"))   
        })
    }
}
