import * as DOMElements from "./DOMElements.js";
import {
    SearchNewFriends, RenderSearchResult, SearchOldFriends, FetchSelectedItemIDsByCondition,
    CheckRelationship, SendFriendRequest, EmitFriendRequestResultEvent, UpdateFriends
} from "./ManageFriend.js";
import { 
    ControlFriendMsgBox, ClearList, RenderList, SwitchSettingBtn,
    SwitchPullAndDropBtn, ShowPannelContent, SwitchMenuToggle, onWhichPannelContent,
    SwitchPannel, SwitchMenuTitle, isPannelPulledUp, ControlTeamMsgBox, ExpandOrClosePannel,
    RenderOnlineStatus,
    ReRenderList
} from "./GeneralControl.js";
import { CreateNewTeam, SearchTeams, EmitEnterTeamEvent, EmitInviteTeamEvent, EmitJoinTeamRequestEvent, EmitAcceptTeamRequestEvent, EmitLeaveTeamEvent } from "./ManageTeam.js";
import { AddTeamClickEvent, AddTeamHoverEvent } from "./TeamEvent.js";
import { ManipulateSessionStorage, RenderAvatar, RenderUsername } from "./ManageUser.js";
import { AppendUserInPartnerList, BuildPartnership, UpdatePartnersColor} from "./ManagePartner.js";
import { mapInfo, messageInfo, onlineUserInfo} from "../main.js";
import { RenderMessageBtn, SearchMessage } from "./ManageMessage.js";
import { CollectUpdateBasicInfo, PreviewAvatar, RenderUpdateResponse, UpdateBasicInfo } from "./ManageConfigure.js";


export const AllEvents = [
    AddEventsToSetting, AddEventsToSwitchPannelContent, AddEventsToFriend,
    AddEventsToTeam, AddEventsToPullAndDrop, AddEventToClose
]


export function AddEventsToSetting() {
    // ----- toggle down setting  -----
    DOMElements.settingBtn.addEventListener("click", ()=>{SwitchSettingBtn()})

    // ----- logout button -----
    DOMElements.logout.addEventListener("click", () => {
        window.localStorage.removeItem("token");
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
    avatarInput.addEventListener("change", PreviewAvatar);

    // Be albe to modify username
    const modifyButton = document.querySelector("img.modify");
    modifyButton.addEventListener("click", ()=>{
        const disabledStatus = document.querySelector("input#username-to-update").disabled;
        document.querySelector("input#username-to-update").disabled = !disabledStatus;
    })

    // click close to initialize update-response prompt
    const updateResponseCloseBtn = document.querySelector(".configure-response .close");
    updateResponseCloseBtn.addEventListener("click", ()=>{
        RenderUpdateResponse(3);
        document.querySelector(".configure-response").style.display = "none";
        document.querySelector(".configure-outer .image .undo").style.display = "none";
    });

    // click close to initialzie update-pannel input value
    const configPannelCloseBtn = document.querySelector(".configure-pannel .close");
    configPannelCloseBtn.addEventListener("click", ()=>{
        document.querySelector("input#avatar").value = "";
        document.querySelector(".configure-outer .image").style.backgroundImage = `url(${window.sessionStorage.getItem("image_url")})`;
        document.querySelector(".configure-pannel input#username-to-update").value = window.sessionStorage.getItem("username");
        document.querySelector(".configure-outer .image .undo").style.display = "none";
    })

    // undo file seleted
    const undo = document.querySelector(".configure-outer .image .undo");
    undo.addEventListener("click", ()=>{
        document.querySelector(".configure-outer .image").style.backgroundImage = `url(${window.sessionStorage.getItem("image_url")})`;
        document.querySelector("input#avatar").value = "";
        document.querySelector(".configure-outer .image .undo").style.display = "none";
    })

    // Sending request
    const confirmUpdateBasicBtn = document.querySelector("button.update-basic");
    confirmUpdateBasicBtn.addEventListener("click", ()=>{
        CollectUpdateBasicInfo()
            .then((dataToUpdate)=>{
                document.querySelector(".configure-response").style.display = "flex";
                document.querySelector(".configure-pannel").style.display = "none";
                UpdateBasicInfo(dataToUpdate)
                    .then((updateResponse)=>{
                        // close configure pannel
                        SwitchPannel("main");
        
                        // pop up prompt to show update success
                        RenderUpdateResponse(updateResponse.responseCode);
        
                        // re-render username and avatar in the configure pannel and main pannel
                        if (updateResponse.ok && updateResponse.responseCode === 1 ){
                            if (updateResponse.username !== window.sessionStorage.getItem("username")){
                                RenderUsername(updateResponse.username);
                                ManipulateSessionStorage("set", {username: updateResponse.username});
                            }
                            if (updateResponse.image_url !== ""){
                                RenderAvatar(updateResponse.image_url);
                                ManipulateSessionStorage("set", {image_url: updateResponse.image_url});
                            }
                        }

                        //remove the value(file) of input#avatar
                        document.querySelector("input#avatar").value = "";
                        document.querySelector(".configure-outer .image .undo").style.display = "none";
                    })
                    .catch((updateResponse)=>{
                        RenderUpdateResponse(updateResponse.responseCode);
                        console.log(updateResponse.message)
                    })
            })
            .catch((error) => {
                RenderUpdateResponse(2)
                console.log(error)
            })
    })
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
                expandOrClose = (!isPulledUp) ? "expand" : "close",
                pannelAndContent = onWhichPannelContent();

            SwitchPullAndDropBtn(`.${parentPannelCssSelector}`);
            ExpandOrClosePannel(`.${parentPannelCssSelector}`, expandOrClose);
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
        searchInput.setAttribute("placeholder", "搜尋姓名");

        while (DOMElements.searchList.hasChildNodes()) {
            DOMElements.searchList.removeChild(DOMElements.searchList.lastChild)
        }

        if (searchInput.value === "") {
            searchInput.setAttribute("placeholder", "請填入姓名");
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
            selectedItemFrom = FetchSelectedItemIDsByCondition(null),
            selectedFriends = selectedItemFrom(".friend-pannel"),
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

        // update information for following execution: onlineUserInfo and messageInfo
        const userID = Number(window.sessionStorage.getItem("user_id")); 
        onlineUserInfo.EmitSyncOnlineUserEvent();
        SearchMessage(userID)
            .then((messages)=>{
                messages.forEach(message => messageInfo.UpdateInfo(message))
            })
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
        const {user_id, username} = window.sessionStorage;
        UpdateFriends(Number(user_id), {
            senderID: friend_sender_info_cache.user_id,
            senderName: friend_sender_info_cache.username,
            receiverID: Number(user_id),
            receiverName: username
        });
    })

    // if reject request
    let friendNoBtn = document.querySelector(".friend-prompt .no");
    friendNoBtn.addEventListener("click", () => {
        ControlFriendMsgBox(".friend-prompt", "none")

        // feedback result to sender
        const {user_id, username} = window.sessionStorage;
        EmitFriendRequestResultEvent(false, {
                senderID: friend_sender_info_cache.user_id,
                senderName: friend_sender_info_cache.username,
                receiverID: user_id,
                receiverName: username
        })
    })

    // confirm frined response
    let friendOkBtn = document.querySelector(".friend-response button");
    friendOkBtn.addEventListener("click", ()=>{ControlFriendMsgBox(".friend-response", "none")})
}

export function AddEventsToTeam() {
    // ----- move to add team page-----
    DOMElements.addTeam.addEventListener("click", ()=>{
        SwitchPannel("team");
        ExpandOrClosePannel(".team-pannel", "expand");
        ShowPannelContent(".team-pannel", "create", true);
    });

    // ----- create a new team -----
    DOMElements.createTeamBtn.addEventListener("click", () => {
        let searchInput = document.querySelector("input[name=create-team]");
        searchInput.setAttribute("placeholder", "請輸入隊伍名稱");

        if (searchInput.value === "") {
            searchInput.setAttribute("placeholder", "請輸入隊伍名稱");
            return
        }
        CreateNewTeam(window.sessionStorage.getItem("user_id"), searchInput.value)
            .then((result)=>{
                SearchTeams(window.sessionStorage.getItem("user_id"), "created")
                    .then((result) => {
                        createdTeamArray = [...result.createdTeamList];
                        ClearList(".create-list");
                        RenderList(".create-list", result.createdTeamList);
                        AddTeamClickEvent(".create-list .item");
                        AddTeamHoverEvent(".create-list .item");
                    })
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
            selectedItemsFrom = FetchSelectedItemIDsByCondition(null),
            selectedFriends = selectedItemsFrom(".team-pannel"),
            friendIdsToAdd = selectedFriends.map(friend => friend.id);

        // UpdatePartnersColor(partnersColor, selectedFriends)
        // UpdatePartnersColor(
        //     partnersColor,
        //     [
        //         {id: window.sessionStorage.getItem("user_id")*1, 
        //         name: window.sessionStorage.getItem("username")}
        //     ], 
        //     ownColor);

        // create owner information in partner-list;
        // others will be created when they join in
        const {user_id:userID, sid, username, image_url:imageUrl} = window.sessionStorage;
        AppendUserInPartnerList(userID, username, imageUrl, document.querySelector(".tracking-pannel .partner-list"));
  
        // send request for joining team
        EmitInviteTeamEvent(
            socket.id, 
            document.querySelector(".team-pannel .pannel-title").getAttribute("id"),
            myCoord, 
            friendIdsToAdd, 
            partnersColor
        );
        EmitEnterTeamEvent(
            true, 
            "create", 
            document.querySelector(".team-pannel .pannel-title").getAttribute("id"),
            myCoord
        );

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
            {user_id:userID, username, image_url:imageUrl} = window.sessionStorage,
            {user_id:leaderID, username: leaderUsername, sid:leaderSid, 
            image_url:leaderImageUrl, coordination:leaderCoordination} = team_sender_info_cache;
        AppendUserInPartnerList(userID, username, imageUrl, partnerList);
        AppendUserInPartnerList(leaderID, leaderUsername, leaderImageUrl, partnerList);
        mapInfo.CreateMarker(leaderSid, leaderImageUrl, leaderCoordination);
 
        // recover team prompt
        ControlTeamMsgBox(".team-invite-prompt", "none");

        // Organize data emitted to listener "enter_team" on server
        EmitEnterTeamEvent(true, "join", team_sender_info_cache.team_id, myCoord);
        ManipulateSessionStorage("set", {team_id: team_sender_info_cache["team_id"]});

        // Create partner record in partner table in database
        BuildPartnership(Number(window.sessionStorage.getItem("user_id")), team_sender_info_cache.team_id)
            .then((result) => {
                SearchTeams(Number(window.sessionStorage.getItem("user_id")), "joined")
                    .then((result) => {
                        joinedTeamArray = [...result.joinedTeamList];
                        ClearList(".join-list");
                        RenderList(".join-list", result.joinedTeamList);
                        RenderOnlineStatus(".join-list .item", onlineTeamArray);
                        AddTeamClickEvent(".join-list .item", onlineTeamArray);
                        AddTeamHoverEvent(".join-list .item");
                    })
            })
            .catch((error) => {console.log(`Error in accept team request : ${error}`)})
    })

    // if reject
    let teamNoBtn = document.querySelector(".team-invite-prompt .no");
    teamNoBtn.addEventListener("click", () => {
        ControlTeamMsgBox(".team-invite-prompt", "none");

        // Organize data emitted to listener "enter_team" on server
        EmitEnterTeamEvent(false, "join", document.querySelector(".team-pannel .pannel-title").getAttribute("id"))
    })

    // ----- confirm team response -----
    let teamOkBtn = document.querySelector(".team-invite-response button");
    teamOkBtn.addEventListener("click", ()=>{ControlTeamMsgBox(".team-invite-response", "none")})

    // ----- emit leave team event to listener "leave_team" on server-----
    DOMElements.leaveTeamBtn.addEventListener("click", ()=> {
        // emit socket event "leave_team"
        const//
            leaderSID = ( team_sender_info_cache === undefined ) ? socket.id : team_sender_info_cache["sid"],
            userID = Number(window.sessionStorage.getItem("user_id")),
            teamID = window.sessionStorage.getItem("team_id");
        EmitLeaveTeamEvent(socket.id, userID, teamID, leaderSID);
        ManipulateSessionStorage("remove", "team_id");
        team_sender_info_cache = undefined;

        // switch to mainPannel
        SwitchPannel("main");
        ExpandOrClosePannel(".main-pannel", "close");
        ShowPannelContent(".main-pannel", "team", false);

        //remove all user in the partner list and just leave own marker on the map
        ClearList(".tracking-pannel .partner-list");
        mapInfo.RemoveAllOtherMarkersExcept(socket.id);

        // re-render message list
        SearchMessage(userID)
            .then((messages) => {
                messages.forEach((message) => {messageInfo.UpdateInfo(message)})
                ReRenderList([".message-list"], messageInfo.GetSenderList());
                SwitchSettingBtn({"all": "none"});
                RenderMessageBtn(false);
            })
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
            selectItemsfrom = FetchSelectedItemIDsByCondition("inviteJoiningTeam", {partnersColor: partnersColor}),
            selectedFriends = selectItemsfrom(".team-pannel"),
            friendIDsToInvite = selectedFriends.map(friend => friend.id);

        UpdatePartnersColor(partnersColor, selectedFriends)
        EmitInviteTeamEvent(
            socket.id, 
            window.sessionStorage.getItem("team_id"), 
            myCoord,
            friendIDsToInvite, 
            partnersColor)

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
            {user_id: userID, sid: userSID, username, image_url:imageUrl} = window.sessionStorage,
            teamID = document.querySelector(".team-pannel .pannel-title").getAttribute("id");
        EmitJoinTeamRequestEvent(socket.id, userID, username, imageUrl, myCoord, teamID);
    })

    // Yes or No response to join team requeset
    // if yes
    let requestYesBtn = document.querySelector(".team-join-request .yes");
    requestYesBtn.addEventListener("click", () => {
        const applicantID = document.querySelector(".team-join-request .content").getAttribute("id");
        // create a new marker color for new partner
        // UpdatePartnersColor(
        //     partnersColor, 
        //     [{id: applicantID, name: document.querySelector(".team-join-request .from").textContent}]
        // );
        // emit event "enter_team" to server to initialize 
        EmitAcceptTeamRequestEvent(true, team_applicants_cache[applicantID].userSID);

        // recover team prompt and remove team_applicants_cache
        ControlTeamMsgBox(".team-join-request", "none");
        delete team_applicants_cache[applicantID];
    })

    // if no
    let requesetNoBtn = document.querySelector(".team-join-request .no");
    requesetNoBtn.addEventListener("click", () => {
        ControlTeamMsgBox(".team-join-request", "none");
        // remove team_applicants_cache
        delete team_applicants_cache[document.querySelector(".team-join-request .content").getAttribute("id")];
    })


}

export function AddEventToClose() {
    for (let closeBtn of DOMElements.closePannel) {
        closeBtn.addEventListener("click", () => {
            SwitchPannel("main");
            ClearList(".team-pannel .friend-list");
        })
    };
}


