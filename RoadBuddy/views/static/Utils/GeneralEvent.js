import * as DOMElements from "./DOMElements.js";
import {
    SearchNewFriends, RenderSearchResult, SearchOldFriends, FetchSelectedItemIDs,
    CheckRelationship, SendFriendRequest, MakeNewFriend, ReplyToSender
} from "./ManageFriend.js";
import { 
    ControlMsgBox, ClearList, RenderList, SwitchSettingBtn,
    SwitchPullAndDropBtn, SwitchMainPannelContent, SwitchMenuToggle
} from "./GeneralControl.js";

export const AllEvents = [
    AddEventsToSetting, AddEventsToSwitchPannel, AddEventsToFriend,
    AddEventsToTeam, AddEventsToPullAndDrop, AddEventsToClose, AddEventsToLogout
]

export function AddEventsToSetting() {
    // ----- toggle down setting  -----
    DOMElements.settingBtn.addEventListener("click", SwitchSettingBtn)
}

export function AddEventsToPullAndDrop() {
    // ----- pull up and drop down main pannel and tracking pannel ------
    DOMElements.pullUp.addEventListener("click", SwitchPullAndDropBtn)
    DOMElements.dropDown.addEventListener("click", SwitchPullAndDropBtn)


    // // ----- pull up and drop down tracking pannel ------
    // DOMElements.pullUpTracking.addEventListener("click", () => {
    //     DOMElements.pullUpTracking.style.display = "none";
    //     DOMElements.dropDownTracking.style.display = "block";
    //     DOMElements.trackingPannel.style.top = "20vh";
    //     DOMElements.trackingPannel.style.height = "80vh";
    // })

    // DOMElements.dropDownTracking.addEventListener("click", () => {
    //     DOMElements.dropDownTracking.style.display = "none";
    //     DOMElements.pullUpTracking.style.display = "block";
    //     DOMElements.trackingPannel.style.top = "70vh";
    //     DOMElements.trackingPannel.style.height = "30vh";
    // })
}

export function AddEventsToSwitchPannel() {
    // ----- switch menu -----
    DOMElements.toggle.addEventListener("click", SwitchMenuToggle)

    // ----- switch content ----
    DOMElements.menuFriend.addEventListener("click", function(){
        SwitchMainPannelContent(this.getAttribute("class").split("-")[2]);   
        // switch add button
        DOMElements.addTeam.style.display = "none";
        DOMElements.addFriend.style.display = "block";

        // turn off menu
        DOMElements.menuList.style.display = "none";
        DOMElements.menu.style.border = "none";
    })

    DOMElements.menuTeam.addEventListener("click", function(){
        SwitchMainPannelContent(this.getAttribute("class").split("-")[2]);   
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
    DOMElements.addFriend.addEventListener("click", () => {
        DOMElements.friendPannel.style.display = "flex";
        DOMElements.mainPannel.style.display = "none";
    });

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
            ControlMsgBox(".friend-request", "block",
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
                ControlMsgBox(".friend-request", "block",
                    {
                        selectedFriendIDs: selectedFriendIDs,
                        repetitionIDs: repetitionIDs,
                        oldFriendsList: oldFriendsList
                    })
            })
            .catch(error => console.log(error))
    });

    // --- clear response content and disappear ---
    DOMElements.friendRequestBtn.addEventListener("click", () => {
        ControlMsgBox(".friend-request", "none")
    });

    // --- Acceptance of friend request ---
    DOMElements.friendYesBtn.addEventListener("click", () => {
        // recover friend prompt
        ControlMsgBox(".friend-prompt", "none")

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
                ControlMsgBox(".friend-response", "block",
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
        ControlMsgBox(".friend-prompt", "none")

        // feedback result to sender
        ReplyToSender(
            false, 
            socket.id, 
            friend_sender_info_cache.sid, 
            friend_sender_info_cache.user_id)
    })
}

export function AddEventsToTeam() {
    // ----- add team page-----
    DOMElements.addTeam.addEventListener("click", () => {
        DOMElements.teamPannel.style.display = "flex";
        DOMElements.mainPannel.style.display = "none";
        document.querySelectorAll(".team-pannel .pannel-title")[1].style.display = "none";
        document.querySelector(".team-pannel .friend-outer").style.display = "none";
    });

    DOMElements.createTeamBtn.addEventListener("click", () => {
        let searchInput = document.querySelector("input[name=create-team]");
        searchInput.setAttribute("placeholder", "請輸入隊伍名稱");

        if (searchInput.value === "") {
            searchInput.setAttribute("placeholder", "請輸入隊伍名稱");
            return
        }

        fetch("/api/team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                team_name: searchInput.value,
                user_id: window.sessionStorage.getItem("user_id")
            })
        })
            .then((response) => { return response.json() })
            .then((result) => {

                if (result.error) {
                    searchInput.value = "";
                    searchInput.setAttribute("placeholder", "隊伍名稱已被使用，請輸入其他名稱");
                    return
                }

                let//
                    createList = document.querySelector(".create-list"),
                    joinList = document.querySelector(".join-list");

                while (createList.hasChildNodes()) {
                    createList.removeChild(createList.lastChild)
                }

                // while ( joinList.hasChildNodes() ) {
                //     joinList.removeChild(joinList.lastChild)
                // }

                LoadTeamList(window.sessionStorage.getItem("user_id"));

                DOMElements.teamPannel.style.display = "none";
                DOMElements.mainPannel.style.display = "block";
                document.querySelectorAll(".team-pannel .pannel-title")[1].style.display = "block";
                document.querySelector(".team-pannel .friend-outer").style.display = "block";

                // response when creation succeed
                let//
                    teamCreateResponse = document.querySelector(".team-create-response"),
                    content = document.querySelector(".team-create-response .content");
                content.textContent = `你已建立隊伍 ${searchInput.value}`;
                teamCreateResponse.style.display = "block";
                DOMElements.mainPannel.style.top = "65vh";

            })
            .catch((error) => { console.log(`Error in creating team : ${error}`) })
    });

    // close team-create-response when click ok
    DOMElements.createOkBtn.addEventListener("click", () => {
        let//
            teamCreateResponse = document.querySelector(".team-create-response"),
            content = document.querySelector(".team-create-response .content");
        teamCreateResponse.style.display = "none";
        content.textContent = ``;
    });

    // confirm frined response
    let friendOkBtn = document.querySelector(".friend-response button");
    friendOkBtn.addEventListener("click", ()=>{
        ControlMsgBox(".friend-response", "none") 
    })
}





export function AddEventsToClose() {
    // ----- close pannel ----
    for (close of DOMElements.closePannel) {
        close.addEventListener("click", () => {
            // back to main pannel
            DOMElements.friendPannel.style.display = "none";
            DOMElements.teamPannel.style.display = "none";
            DOMElements.mainPannel.style.display = "block";
            document.querySelectorAll(".team-pannel .pannel-title")[1].style.display = "block";;
            document.querySelector(".team-pannel .friend-outer").style.display = "block";

            // team-pannel recover
            document.querySelector(".team-pannel .pannel-title").textContent = "創建隊伍";
            document.querySelector(".friend-outer").style.height = "40%";
            document.querySelector(".team-pannel .search").style.display = "flex";
            DOMElements.createTeamBtn.style.display = "block";
            DOMElements.startTripBtn.style.display = "none";
            while (DOMElements.searchList.hasChildNodes()) {
                DOMElements.searchList.removeChild(DOMElements.searchList.lastChild)
            }
        })
    };
}

export function AddEventsToLogout() {
    // ----- logout -----
    DOMElements.logout.addEventListener("click", () => {
        window.localStorage.removeItem("token");
        window.location.replace("/member");
    })
}


