import * as DOMElements from "./DOMElements.js";

// export function SwitchPullAndDropBtnSet(pannelType){
//     const//
//         dropDownBtns = document.querySelectorAll("div[class^=drop-down-]"),
//         pullUpBtns = document.querySelectorAll("div[class^=pull-up-]");

//     // 1. Show pullUpBtn on the pannel; others disappear.
//     for (let btn of pullUpBtns) {
//         const onPannel = (btn.getAttribute("class").split("-")[2] === pannelType);
//         if (onPannel){
//             btn.style.display = "block";
//             continue
//         }
//         btn.style.display = "none";
//     }
//     // 2. All dropDownBtns disappear.
//     for (let btn of dropDownBtns){
//         btn.style.display = "none";
//     }
// }


export function SwitchPullAndDropBtn(pullUpOrDropDown){
    //1. switch pullup and dropdown btn
    const//
        pullUpBtn = document.querySelector(".pull-up"),
        dropDown = document.querySelector(".drop-down");
    pullUpBtn.style.display = (pullUpOrDropDown === "pullUp") ? "none" : "block";
    dropDown.style.display = (pullUpOrDropDown === "pullUp") ? "block" : "none";

    //2. adjust main pannel top and heigth (70vh top + 30vh height or 20vh top + 80vh height)
    DOMElements.mainPannel.style.top = (pullUpOrDropDown === "pullUp") ? "20vh" : "70vh";
    DOMElements.mainPannel.style.height = (pullUpOrDropDown === "pullUp") ? "80vh" : "30vh"; 

    //3. adjust color-intro (flex or none), outer(flex or none)
    const elementsOnMainPannel = [
        DOMElements.friendColorIntro, DOMElements.teamColorIntro, 
        DOMElements.mainPannelFriendsOuter, DOMElements.teamsOuter];
    for ( let element of elementsOnMainPannel){
        element.style.display = (pullUpOrDropDown === "pullUp") ? "flex" : "none";
    }
}

export function SwitchSettingBtn(){
    const//
        btnsForMainPannel = [DOMElements.config, DOMElements.logout],
        btnsForTrackingPannel = [DOMElements.invite, DOMElements.leave];
    
    const onMainPannel = (DOMElements.mainPannel.style.display === "block");
    // on main pannel
    if (onMainPannel) {
        btnsForMainPannel.forEach((btn) => {
            btn.style.display = (btn.style.display === "none") ? "block" : "none";
        })
        btnsForTrackingPannel.forEach((btn) => {btn.style.display === "none"})
        return
    }

    // on tracking pannel
    btnsForTrackingPannel.forEach((btn)=>{
        btn.style.display = (btn.style.display === "none") ? "block" : "none";
    })
    btnsForMainPannel.forEach((btn) => {btn.style.display === "none"})
}

export function SwitchMainPannelContent(){
    const// 
        friendContent = [DOMElements.friendColorIntro, DOMElements.mainPannelFriendsOuter],
        teamContent = [DOMElements.teamColorIntro, DOMElements.teamsOuter];
    const//
        selectFriend = (DOMElements.menuTitle.textContent === DOMElements.menuFriends.textContent),
        isPulledUp = (DOMElements.mainPannel.style.top === "20vh");
    // select friend list
    if (selectFriend){
        friendContent.forEach((content) => {content.style.display = (isPulledUp) ? "flex" : "none";})
        teamContent.forEach((content) => {content.style.display = "none";})
    }
    
    //select team list
    teamContent.forEach((content) => {content.style.display = (isPulledUp) ? "flex" : "none";})
    friendContent.forEach((content) => {content.style.display = "none";})
}

export function SwitchPannel(toPannelType){
    // 1. switch pannel
    const pannels = document.querySelectorAll("")

    // 2. switch pannel title content

    // 3. switch pull and drop btns

    // 4. switch setting btns

    // 5. switch add friend or add team btns
}

export function switchToTrackingPannel() {
    // switch to tracking pannel
    DOMElements.mainPannel.style.display = "none";
    DOMElements.friendsPannel.style.display = "none";
    DOMElements.teamsPannel.style.display = "none";
    DOMElements.trackingPannel.style.display = "block";


    // change elements in setting div
    DOMElements.settingOnMain.style.display = "none";
    DOMElements.settingOffMain.style.display = "none";
    DOMElements.settingOnTracking.style.display = "block";
    DOMElements.settingOffTracking.style.display = "none";
};

export function switchPannel(toPannel, ...turnOnBtns) {
    let//
        pannels = [
            DOMElements.mainPannel,
            DOMElements.friendsPannel,
            DOMElements.teamsPannel,
            DOMElements.trackingPannel
        ],
        btns = [
            DOMElements.settingOnMain,
            DOMElements.settingOffMain,
            DOMElements.settingOnTracking,
            DOMElements.settingOffTracking,
            DOMElements.logout,
            DOMElements.invite,
            DOMElements.leave,
            DOMElements.pullUpFriend,
            DOMElements.pullUpTeam,
            DOMElements.pullUpTracking,
            DOMElements.dropDownFriend,
            DOMElements.dropDownTeam,
            DOMElements.dropDownTracking
        ];

    // turn on specified pannel; others would be turned off
    for (let pannel of pannels) {
        if (pannel === toPannel) {
            pannel.style.display = "block"
            continue
        }
        pannel.style.display = "none"
    }

    // turn on specified button; others would be turned off
    for (let btn of btns) {
        if (turnOnBtns.includes(btn)) {
            btn.style.display = "block"
            continue
        }
        btn.style.display = "none"
    }
}

export function ControlMsgBox(msgCssSelector, display, ...rest) {
    if (display === "none") {
        let//
            msgBox = document.querySelector(msgCssSelector),
            msgBoxContent = document.querySelector(`${msgCssSelector} .content`);

        msgBoxContent.textContent = "";
        msgBox.style.display = display;
        return
    }

    if (msgCssSelector === ".friend-prompt" && display === "block") {
        let//
            msgBox = document.querySelector(msgCssSelector),
            msgBoxContent = document.querySelector(`${msgCssSelector} .content`);
        msgBoxContent.textContent = `來自 ${rest[0].friendName} 的好友邀請`;
        msgBox.style.display = display;
        return
    }

    if (msgCssSelector === ".friend-request" && display === "block") {
        let//
            msgBox = document.querySelector(msgCssSelector),
            msgBoxContent = document.querySelector(`${msgCssSelector} .content`),
            statement = `已發出交友申請`;

        // Not allowed if no one is selected
        if (rest[0].selectedFriendIDs.length === 0) { statement = `你尚未選擇對象` }

        // NOT allowed if they are already in friendship 
        // between sender and some of the selected guys
        if (rest[0].repetitionIDs.length !== 0) {
            let repeatIDString = "";
            for (let friend of rest[0].oldFriendsList) {
                if (rest[0].repetitionIDs.includes(friend.user_id)) {
                    repeatIDString += ` ${friend.username} `;
                }
            }
            statement = `你與${repeatIDString}已經是好友關係，請重新選擇對象`;
        }

        msgBoxContent.textContent = statement;
        msgBox.style.display = display;
        return
    }

    if (msgCssSelector === ".friend-response" && display === "block") {
        // response
        let//
            msgBox = document.querySelector(msgCssSelector),
            msgBoxContent = document.querySelector(`${msgCssSelector} .content`);

        if (window.sessionStorage.getItem("user_id") * 1 === rest[0].senderID * 1) {
            msgBoxContent.textContent = (rest[0].accept) ? `${rest[0].receiverUsername} 接受你的好友邀請` : `${rest[0].rest[0].receiverUsername} 拒絕你的好友邀請`;
        }

        if (window.sessionStorage.getItem("user_id") * 1 === rest[0].receiverID * 1) {
            msgBoxContent.textContent = (rest[0].accept) ? `你與 ${rest[0].senderUsername} 已結為好友` : `你已拒絕 ${rest[0].senderUsername} 的好友邀請`;
        }

        msgBox.style.display = "block";
        return
    }
}

export function ClearList(cssSelector) {
    let list = document.querySelector(cssSelector); //".main-pannel .create-list"
    while (list.hasChildNodes()) {
        list.removeChild(list.lastChild);
    }
}

export function RenderList(listCssSelector, listItemArray) {
    let//
        teamListClass = [".create-list", ".join-list"];

    if (teamListClass.includes(listCssSelector)) {
        let list = document.querySelector(listCssSelector); //".create-list"
        for (let item of listItemArray) {
            let team = document.createElement("div");
            team.setAttribute("class", "item");
            team.setAttribute("id", item.team_id);
            team.textContent = item.team_name;
            list.appendChild(team);
        }
        return
    }

    if (listCssSelector === ".main-pannel .friends-list") {
        // Load friend list in main pannel
        for (let item of listItemArray) {
            let friend = document.createElement("div");
            friend.setAttribute("class", "item");
            friend.setAttribute("id", item["user_id"]);
            friend.textContent = item.username;
            DOMElements.mainPannelFriendsList.appendChild(friend);
        }
        return
    }

    if (listCssSelector === ".teams-pannel .friends-list") {
        // Load friend list in team pannel
        for (let item of listItemArray) {
            let//
                friend = document.createElement("div"),
                input = document.createElement("input"),
                label = document.createElement("label");

            friend.setAttribute("class", "item");
            friend.setAttribute("id", item.user_id);
            input.setAttribute("type", "checkbox");
            input.setAttribute("id", item.user_id);
            input.setAttribute("name", item.username);
            label.setAttribute("for", item.username);
            label.textContent = item.username;

            friend.appendChild(input);
            friend.appendChild(label);
            friend.style.display = "none"; //switch to block when friend is online
            DOMElements.teamPannelFriendsList.appendChild(friend);
        }
        return
    }
}

export function RenderOnlineStatus(itemCssSelector, onlineItemArray) {
    let// 
        items = document.querySelectorAll(itemCssSelector), //".main-pannel .friends-list .item"
        onlineStyle = { backgroundColor: "rgb(182, 232, 176)", border: "solid 3px rgb(22, 166, 6)" },
        offlineStyle = { backgroundColor: "rgb(235, 234, 234)", border: "solid 3px rgb(182, 181, 181)" };

    if (itemCssSelector === ".main-pannel .friends-list .item" ||
        itemCssSelector === ".join-list .item") 
    {   
        for (let item of items) {
            const itemIsOnline = (itemCssSelector === ".main-pannel .friends-list .item") ?
                                onlineItemArray.includes(item.getAttribute("id") * 1) :
                                onlineItemArray.includes(item.getAttribute("id")) ;
            if (itemIsOnline) {
                item.style.backgroundColor = onlineStyle.backgroundColor;
                item.style.border = onlineStyle.border;
                continue;
            }

            item.style.backgroundColor = offlineStyle.backgroundColor;
            item.style.border = offlineStyle.border;
        }
        return
    }

    if (itemCssSelector === ".teams-pannel .friends-list .item") {
        for (let item of items) {
            const friendIsOnline = onlineItemArray.includes(item.getAttribute("id") * 1);
            if (friendIsOnline) {
                item.style.display = "flex";
                continue;
            }
            item.style.display = "none";
        }
        return
    }

}