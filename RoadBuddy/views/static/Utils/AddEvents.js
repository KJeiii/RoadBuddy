import * as DOMElements from "./DOMElements.js";
import { LoadFriendList } from "./LoadFriendList.js"
import {
    SearchNewFriends, RenderSearchResult, SearchOldFriends, FetchSelectedItemIDs,
    CheckRelationship, SendFriendRequest, MakeNewFriend, SendFriendResponse
} from "./ManageFriends.js";
import { ControlMsgBox } from "./GeneralControl.js";

export const AllEvents = [
    AddEventsToSetting, AddEventsToSwitchPannel, AddEventsToFriend,
    AddEventsToTeam, AddEventsToPullAndDrop, AddEventsToClose, AddEventsToLogout
]

export function AddEventsToSetting() {
    // ----- toggle down setting  -----
    DOMElements.settingOnMain.addEventListener("click", () => {
        // config.style.display = "block";
        DOMElements.logout.style.display = "block";
        DOMElements.invite.style.display = "none";
        DOMElements.leave.style.display = "none";
        DOMElements.settingOnMain.style.display = "none";
        DOMElements.settingOffMain.style.display = "block";
    })

    DOMElements.settingOffMain.addEventListener("click", () => {
        // config.style.display = "none";
        DOMElements.logout.style.display = "none";
        DOMElements.invite.style.display = "none";
        DOMElements.leave.style.display = "none";
        DOMElements.settingOffMain.style.display = "none";
        DOMElements.settingOnMain.style.display = "block";
    })

    DOMElements.settingOnTracking.addEventListener("click", () => {
        // config.style.display = "none";
        DOMElements.logout.style.display = "none";
        DOMElements.invite.style.display = "none";
        DOMElements.leave.style.display = "block";
        DOMElements.settingOnTracking.style.display = "none";
        DOMElements.settingOffTracking.style.display = "block";

        if (GlobalVars.team_sender_info_cache === undefined) {
            DOMElements.invite.style.display = "block";
        }
    })

    DOMElements.settingOffTracking.addEventListener("click", () => {
        // config.style.display = "none";
        DOMElements.logout.style.display = "none";
        DOMElements.invite.style.display = "none";
        DOMElements.leave.style.display = "none";
        DOMElements.settingOnTracking.style.display = "block";
        DOMElements.settingOffTracking.style.display = "none";
    })
}

export function AddEventsToSwitchPannel() {
    // ----- switch menu -----
    DOMElements.toggleOn.addEventListener("click", () => {
        DOMElements.menu.style.border = "0.5px solid rgb(151, 150, 150)";
        DOMElements.menuList.style.display = "block";
        DOMElements.toggleOn.style.display = "none";
        DOMElements.toggleOff.style.display = "block";
    })

    DOMElements.toggleOff.addEventListener("click", () => {
        DOMElements.menu.style.border = "none";
        DOMElements.menuList.style.display = "none";
        DOMElements.toggleOff.style.display = "none";
        DOMElements.toggleOn.style.display = "block";
    })

    DOMElements.menuFriends.addEventListener("click", () => {
        DOMElements.menuTitle.textContent = DOMElements.menuFriends.textContent;
        DOMElements.menuList.style.display = "none";
        DOMElements.menu.style.border = "none";

        let isPulledUp = (DOMElements.mainPannel.style.top === "20vh") ? true : false;
        // switch content
        DOMElements.teamsOuter.style.display = "none";
        DOMElements.teamColorIntro.style.display = "none";
        DOMElements.mainPannelFriendsOuter.style.display = (isPulledUp) ? "flex" : "none";
        DOMElements.friendColorIntro.style.display = (isPulledUp) ? "flex" : "none";

        // switch pullup and dropdown button
        DOMElements.pullUpTeam.style.display = "none";
        DOMElements.dropDownTeam.style.display = "none";
        DOMElements.pullUpFriend.style.display = (isPulledUp) ? "none" : "block";
        DOMElements.dropDownFriend.style.display = (isPulledUp) ? "block" : "none";

        // switch add button
        DOMElements.addTeam.style.display = "none";
        DOMElements.addFriend.style.display = "block";
    })

    DOMElements.menuTeam.addEventListener("click", () => {
        DOMElements.menuTitle.textContent = DOMElements.menuTeam.textContent;
        DOMElements.menuList.style.display = "none";
        DOMElements.menu.style.border = "none";

        let isPulledUp = (DOMElements.mainPannel.style.top === "20vh") ? true : false;
        // switch content

        DOMElements.mainPannelFriendsOuter.style.display = "none";
        DOMElements.friendColorIntro.style.display = "none";
        DOMElements.teamsOuter.style.display = (isPulledUp) ? "flex" : "none";
        DOMElements.teamColorIntro.style.display = (isPulledUp) ? "flex" : "none";

        // switch pullup and dropdown button
        DOMElements.pullUpFriend.style.display = "none";
        DOMElements.dropDownFriend.style.display = "none";
        DOMElements.pullUpTeam.style.display = (isPulledUp) ? "none" : "block";
        DOMElements.dropDownTeam.style.display = (isPulledUp) ? "block" : "none";

        // switch add button
        DOMElements.addTeam.style.display = "block";
        DOMElements.addFriend.style.display = "none";

    })
}

export function AddEventsToFriend() {
    // ----- switch to add friend page-----
    DOMElements.addFriend.addEventListener("click", () => {
        DOMElements.friendsPannel.style.display = "flex";
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
            .then(newfriendsList => RenderSearchResult(newfriendsList))
            .catch(error => console.log(error))
    });

    // --- send add friend request ---
    DOMElements.addFriendBtn.addEventListener("click", () => {
        let selectedFriendIDs = FetchSelectedItemIDs(".friends-pannel");
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
                ControlMsgBox("friend-request", "block",
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
        ControlMsgBox("friend-prompt", "none")

        // receiver fetch api to add friend
        MakeNewFriend(window.sessionStorage.getItem("user_id"), friend_sender_info_cache.user_id)
            .then(() => {
                // update latest friend list
                // 1. remove old list
                while (DOMElements.mainPannelFriendsList.hasChildNodes()) {
                    DOMElements.mainPannelFriendsList.removeChild(DOMElements.mainPannelFriendsList.lastChild)
                }
            })
            .then(() => {
                // 2. create new list
                LoadFriendList(window.sessionStorage.getItem("user_id"))
                    .then(() => {
                        // switch to main pannel
                        DOMElements.friendsPannel.style.display = "none";
                        DOMElements.mainPannel.style.display = "block";
                    })
                    .catch((error) => { console.log(error) })
            })
            .then(() => {
                // update server friend_list in user_info dict
                let//
                    friend_list = [],
                    friend_items = document.querySelectorAll(".main-pannel .friends-list .item");
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
                SendFriendResponse(true, socket.id, friend_sender_info_cache.sid, friend_sender_info_cache.user_id)
            })
            .then(() => {
                // show response
                ControlMsgBox("friend-response", "block",
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
        ControlMsgBox("friend-prompt", "none")

        // feedback result to sender
        SendFriendResponse(false, socket.id, friend_sender_info_cache.sid, friend_sender_info_cache.user_id)

        // show response > no need to show response
        // ControlMsgBox("friend-response", "block",
        // {
        //     accept: false,
        //     senderID: friend_sender_info_cache.user_id,
        //     senderUsername: friend_sender_info_cache.username,
        //     receiverID: window.sessionStorage.getItem("user_id"),
        //     receiverUsername: window.sessionStorage.getItem("username"),
        // }
        // )
    })
}

export function AddEventsToTeam() {
    // ----- add team page-----
    DOMElements.addTeam.addEventListener("click", () => {
        DOMElements.teamsPannel.style.display = "flex";
        DOMElements.mainPannel.style.display = "none";
        document.querySelectorAll(".teams-pannel .pannel-title")[1].style.display = "none";
        document.querySelector(".teams-pannel .friends-outer").style.display = "none";
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

                DOMElements.teamsPannel.style.display = "none";
                DOMElements.mainPannel.style.display = "block";
                document.querySelectorAll(".teams-pannel .pannel-title")[1].style.display = "block";
                document.querySelector(".teams-pannel .friends-outer").style.display = "block";

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
}

export function AddEventsToTeamItems(teamType) {
    if (teamType === "created") {
        let createdTeamList = document.querySelectorAll(".create-list .item");

        // click event
        for (let item of createdTeamList) {
            item.addEventListener("click", function () {
                document.querySelector(".teams-pannel .pannel-title").textContent = this.textContent;
                document.querySelector(".teams-pannel .pannel-title").setAttribute("id", this.getAttribute("id"));
                document.querySelector(".teams-pannel .search").style.display = "none";
                document.querySelector(".friends-outer").style.height = "55%";
                DOMElements.createTeamBtn.style.display = "none";
                DOMElements.startTripBtn.style.display = "block";
                DOMElements.inviteTripBtn.style.display = "none";
                DOMElements.mainPannel.style.display = "none";
                DOMElements.teamsPannel.style.display = "flex";
            });

            // mouseover and mouseout event
            item.addEventListener("mouseover", () => {
                item.style.backgroundColor = "rgb(186, 185, 185)"
            })
            item.addEventListener("mouseout", () => {
                item.style.backgroundColor = "rgb(235, 234, 234)"
            })
        }
    }
    if (teamType === "joined") {
        let joinedTeamList = document.querySelectorAll(".join-list .item");
        for (let item of joinedTeamList) {
            // onmouseover and on mouseout event
            item.addEventListener("mouseover", () => {
                let overBackgroundColor = (item.style.border === "3px solid rgb(182, 181, 181)") ? "rgb(186, 185, 185)" : "rgb(22, 166, 6)";
                item.style.backgroundColor = overBackgroundColor;
            })
            item.addEventListener("mouseout", () => {
                let outBackgroundColor = (item.style.border === "3px solid rgb(182, 181, 181)") ? "rgb(235, 234, 234)" : "rgb(182, 232, 176)";
                item.style.backgroundColor = outBackgroundColor;
            })
        }
    }
}

export function AddEventsToPullAndDrop() {
    // ----- pull up and drop down main pannel and tracking pannel ------
    DOMElements.pullUpFriend.addEventListener("click", () => {
        DOMElements.pullUpFriend.style.display = "none";
        DOMElements.dropDownFriend.style.display = "block";
        DOMElements.mainPannel.style.top = "20vh";
        DOMElements.mainPannel.style.height = "80vh";
        DOMElements.friendColorIntro.style.display = "flex";
        DOMElements.mainPannelFriendsOuter.style.display = "flex";
    })

    DOMElements.dropDownFriend.addEventListener("click", () => {
        DOMElements.dropDownFriend.style.display = "none";
        DOMElements.pullUpFriend.style.display = "block";
        DOMElements.mainPannel.style.top = "70vh";
        DOMElements.mainPannel.style.height = "30vh";
        DOMElements.friendColorIntro.style.display = "none";
        DOMElements.mainPannelFriendsOuter.style.display = "none";
    })

    DOMElements.pullUpTeam.addEventListener("click", () => {
        DOMElements.pullUpTeam.style.display = "none";
        DOMElements.dropDownTeam.style.display = "block";
        DOMElements.mainPannel.style.top = "20vh";
        DOMElements.mainPannel.style.height = "80vh";
        DOMElements.teamColorIntro.style.display = "flex";
        DOMElements.teamsOuter.style.display = "flex";
    })

    DOMElements.dropDownTeam.addEventListener("click", () => {
        DOMElements.dropDownTeam.style.display = "none";
        DOMElements.pullUpTeam.style.display = "block";
        DOMElements.mainPannel.style.top = "70vh";
        DOMElements.mainPannel.style.height = "30vh";
        DOMElements.teamColorIntro.style.display = "none";
        DOMElements.teamsOuter.style.display = "none";
    })


    // ----- pull up and drop down tracking pannel ------
    DOMElements.pullUpTracking.addEventListener("click", () => {
        DOMElements.pullUpTracking.style.display = "none";
        DOMElements.dropDownTracking.style.display = "block";
        DOMElements.trackingPannel.style.top = "20vh";
        DOMElements.trackingPannel.style.height = "80vh";
    })

    DOMElements.dropDownTracking.addEventListener("click", () => {
        DOMElements.dropDownTracking.style.display = "none";
        DOMElements.pullUpTracking.style.display = "block";
        DOMElements.trackingPannel.style.top = "70vh";
        DOMElements.trackingPannel.style.height = "30vh";
    })
}

export function AddEventsToClose() {
    // ----- close pannel ----
    for (close of DOMElements.closePannel) {
        close.addEventListener("click", () => {
            // back to main pannel
            DOMElements.friendsPannel.style.display = "none";
            DOMElements.teamsPannel.style.display = "none";
            DOMElements.mainPannel.style.display = "block";
            document.querySelectorAll(".teams-pannel .pannel-title")[1].style.display = "block";;
            document.querySelector(".teams-pannel .friends-outer").style.display = "block";

            // teams-pannel recover
            document.querySelector(".teams-pannel .pannel-title").textContent = "創建隊伍";
            document.querySelector(".friends-outer").style.height = "40%";
            document.querySelector(".teams-pannel .search").style.display = "flex";
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


