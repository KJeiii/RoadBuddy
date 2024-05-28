import * as DOMElements from "./DOMElements.js";
import {
    SearchNewFriends, RenderSearchResult, SearchOldFriends, FetchSelectedItemIDs,
    CheckRelationship, SendFriendRequest, MakeNewFriend, ReplyToSender
} from "./ManageFriend.js";
import { 
    ControlFriendMsgBox, ClearList, RenderList, SwitchSettingBtn,
    SwitchPullAndDropBtn, ShowPannelContent, SwitchMenuToggle, onWhichPannelContent,
    SwitchPannel, SwitchMenuTitle, isPannelPulledUp, ControlTeamMsgBox, ExpandOrClosePannel,
} from "./GeneralControl.js";
import { CreateNewTeam, SearchTeams } from "./ManageTeam.js";
import { AddTeamClickEvent, AddTeamHoverEvent } from "./TeamEvent.js";


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
        let selectedFriendIDs = FetchSelectedItemIDs(".friend-pannel");
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


