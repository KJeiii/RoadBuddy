import * as DOMElements from "./DOMElements.js";
import {
    SearchNewFriends, RenderSearchResult, SearchOldFriends, FetchSelectedItemIDs,
    CheckRelationship, SendFriendRequest, MakeNewFriend, ReplyToSender, FetchSelectedItemIDsByCondition
} from "./ManageFriend.js";
import { 
    ControlFriendMsgBox, ClearList, RenderList, SwitchSettingBtn,
    SwitchPullAndDropBtn, ShowPannelContent, SwitchMenuToggle, onWhichPannelContent,
    SwitchPannel, SwitchMenuTitle, isPannelPulledUp, ControlTeamMsgBox, ExpandOrClosePannel,
    RenderOnlineStatus
} from "./GeneralControl.js";
import { CreateNewTeam, SearchTeams, EmitEnterTeamEvent, EmitInviteTeamEvent } from "./ManageTeam.js";
import { AddTeamClickEvent, AddTeamHoverEvent } from "./TeamEvent.js";
import { ManipulateSessionStorage } from "./ManageUser.js";
import { appendPartner, BuildPartnership} from "./ManagePartner.js";


export const AllEvents = [
    AddEventsToSetting, AddEventsToSwitchPannelContent, AddEventsToFriend,
    AddEventsToTeam, AddEventsToPullAndDrop, AddEventsToClose, AddEventsToLogout
]


export function AddEventsToSetting() {
    // ----- toggle down setting  -----
    DOMElements.settingBtn.addEventListener("click", ()=>{SwitchSettingBtn()})
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
            selectedFriendIDs = selectedItemFrom(".friend-pannel");

        //  response if no ckeckbox is checked
        if (selectedFriendIDs.length === 0) {
            ControlFriendMsgBox(".friend-request", "block",
                {
                    selectedFriendIDs: selectedFriendIDs,
                    repetitionIDs: [],
                    oldFriendsList: []
                })
            return
        }

        SearchOldFriends(window.sessionStorage.getItem("user_id"))
            .then((oldFriendsList) => {
                let { repetitionIDs, newFriendIDs } = CheckRelationship(selectedFriendIDs, oldFriendsList);
                SendFriendRequest(repetitionIDs, newFriendIDs);
                ControlFriendMsgBox(".friend-request", "block",
                    {
                        selectedFriendIDs: selectedFriendIDs,
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
        MakeNewFriend(window.sessionStorage.getItem("user_id"), friend_sender_info_cache.user_id)
            .then(() => {
                SearchOldFriends(window.sessionStorage.getItem("user_id"))
                    .then((oldFriendList) => {
                        ClearList(".main-pannel .friend-list");
                        RenderList(".main-pannel .friend-list", oldFriendList);
        
                        ClearList(".team-pannel .friend-list");
                        RenderList(".team-pannel .friend-list", oldFriendList);

                        DOMElements.friendPannel.style.display = "none";
                        DOMElements.mainPannel.style.display = "block";
                    })
                    .catch((error)=>{console.log(error)})
            })
            .then(() => {
                // update server friend_list in user_info dict
                let//
                    friend_list = [],
                    friend_items = document.querySelectorAll(".main-pannel .friend-list .item");
                for (item of friend_items) {
                    let friend_info = {
                        user_id: item.getAttribute("id"),
                        username: item.textContent
                    };
                    friend_list.push(friend_info);
                };

                let data = {
                    user_id: window.sessionStorage.getItem("user_id"),
                    username: window.sessionStorage.getItem("username"),
                    email: window.sessionStorage.getItem("email"),
                    friend_list: friend_list
                };
                socket.emit("store_userinfo", data);
            })
            .then(() => {
                // feedback result to sender
                ReplyToSender(
                    true, 
                    socket.id, 
                    friend_sender_info_cache.sid, 
                    friend_sender_info_cache.user_id)
            })
            .then(() => {
                // show response
                ControlFriendMsgBox(".friend-response", "block",
                    {
                        accept: true,
                        senderID: friend_sender_info_cache.user_id,
                        senderUsername: friend_sender_info_cache.username,
                        receiverID: window.sessionStorage.getItem("user_id"),
                        receiverUsername: window.sessionStorage.getItem("username"),
                    }
                )
            })
            .catch((error) => { console.log(error) })
    })

    // if reject request
    let friendNoBtn = document.querySelector(".friend-prompt .no");
    friendNoBtn.addEventListener("click", () => {
        ControlFriendMsgBox(".friend-prompt", "none")

        // feedback result to sender
        ReplyToSender(
            false, 
            socket.id, 
            friend_sender_info_cache.sid, 
            friend_sender_info_cache.user_id)
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
        // switch to tracking pannel
        SwitchPannel("tracking");

        // Organize data emitted to listener "enter_team" on server
        let//
        checkboxes = document.querySelectorAll(".team-pannel .item input[type=checkbox]"),
        friendsToAdd = [],
        teamID = document.querySelector(".team-pannel .pannel-title").getAttribute("id");

        ManipulateSessionStorage("set", {team_id: teamID})
        // window.sessionStorage.setItem("team_id", teamID);

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

        // create owner information in partner-list;
        // others will be created when they join in
        let partnerList = document.querySelector(".tracking-pannel .partner-list");
        for ( let id in partnersColor) {
            if (id*1 === window.sessionStorage.getItem("user_id")*1) {
                appendPartner(id, partnerList, partnersColor);
            }
        }

        // send request for joining team
        EmitInviteTeamEvent(socket.id, teamID, friendsToAdd, partnersColor);
        EmitEnterTeamEvent(true, "create", teamID);

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
        // 1. only show team owner and partner it self
        // 2. update other partners when they join in
        let partnerList = document.querySelector(".tracking-pannel .partner-list");
        for ( let id in team_sender_info_cache["partners_color"] ) {
            if ( id*1 === team_sender_info_cache["user_id"]*1 ) {
                appendPartner(id, partnerList, team_sender_info_cache["partners_color"]);
            }

            if ( id*1 === window.sessionStorage.getItem("user_id")*1 ) {
                appendPartner(id, partnerList, team_sender_info_cache["partners_color"]);
            }
        }

        // recover team prompt
        ControlTeamMsgBox(".team-invite-prompt", "none");

        // Organize data emitted to listener "enter_team" on server
        EmitEnterTeamEvent(true, "join", team_sender_info_cache.team_id);
        ManipulateSessionStorage("set", team_sender_info_cache["team_id"]);
        // window.sessionStorage.setItem("team_id", team_sender_info_cache["team_id"])

        // Create partner record in partner table in database
        BuildPartnership(window.sessionStorage.getItem("user_id"), team_sender_info_cache.team_id)
            .then((result) => {
                SearchTeams(window.sessionStorage.getItem("user_id"), "joined")
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

        // switch to mainPannel
        SwitchPannel("main");
        ExpandOrClosePannel(".main-pannel", "close");
        ShowPannelContent(".main-pannel", "team", false);
        SwitchSettingBtn({all: "none"});

        // remove all partner in the tracking pannel
        ClearList(".tracking-pannel .partner-list");
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
        // selectItemsfrom = FetchSelectedItemIDsByCondition(inviteJoiningTeam, {partnersColor: partnersColor}),
        // friendToInvite = selectItemsfrom(".team-pannel");
        
        let//
        friendInputs = document.querySelectorAll(".team-pannel .friend-list input"),
        friendToInvite = [];
        for ( let input of friendInputs ) {
            let user_id = input.getAttribute("id");
            if ( input.checked && !Object.keys(partnersColor).includes(user_id)){
                friendToInvite.push(user_id*1);

                let randomColor = `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`;
                partnersColor[user_id*1] = {
                    username: input.getAttribute("name"),
                    color: randomColor
                };
            }
        }

        EmitInviteTeamEvent(socket.id, window.sessionStorage.getItem("team_id"), friendToInvite, partnersColor)

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
        let team_id = document.querySelector(".team-pannel .pannel-title").getAttribute("id");
        let requesterData = {
            "user_sid": window.sessionStorage.getItem("sid"),
            "user_id": window.sessionStorage.getItem("user_id"),
            "username": window.sessionStorage.getItem("username"),
            "team_id": team_id
        };
        socket.emit("join_team_request", requesterData);
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

        // recover team prompt
        ControlTeamMsgBox(".team-join-request", "none");
    })

    // if no
    let requesetNoBtn = document.querySelector(".team-join-request .no");
    requesetNoBtn.addEventListener("click", () => {
        ControlTeamMsgBox(".team-join-request", "none");
    })


}

export function AddEventsToClose() {
    for (let closeBtn of DOMElements.closePannel) {
        closeBtn.addEventListener("click", () => {
            SwitchPannel("main");
            ClearList(".team-pannel .friend-list");
        })
    };
}

export function AddEventsToLogout() {
    DOMElements.logout.addEventListener("click", () => {
        window.localStorage.removeItem("token");
        window.location.replace("/member");
    })
}


