import * as DOMElements from "./DOMElements.js";

export function switchToTrackingPannel () {
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

export function ControlMsgBox(boxType, display, ...rest){
    if (display === "none") {
        let//
        msgBox = document.querySelector(`.${boxType}`),
        msgBoxContent = document.querySelector(`.${boxType} .content`);

        msgBoxContent.textContent = "";
        msgBox.style.display = display;
        return
    }

    if (boxType === "friend-prompt" && display === "block"){
        let//
        msgBox = document.querySelector(`.${boxType}`),
        msgBoxContent = document.querySelector(`.${boxType} .content`);
        msgBoxContent.textContent = `來自 ${rest[0].friendName} 的好友邀請`;
        msgBox.style.display = display;
        return
    }

    if (boxType === "friend-request" && display === "block"){
        let//
        msgBox = document.querySelector(`.${boxType}`),
        msgBoxContent = document.querySelector(`.${boxType} .content`),
        statement = `已發出交友申請`;

        // NOT allowed if they have been friend between user and one of selected people
        if (rest[0].repetitionIDs.length !== 0){
            let repeatIDString = "";
            for ( let friend of rest[0].oldFriendsList) {
                if (repetitionIDs.includes(friend.user_id) ) {
                    repeatIDString += ` ${friend.username} `;
                }}
            statement = `你與${repeatIDString}已經是好友關係，請重新選擇對象`;
        }

        msgBoxContent.textContent = statement;
        msgBox.style.display = display;
        return
    }

    if (boxType === "friend-response" && display === "block"){
        // response
        let//
        msgBox = document.querySelector(`.${boxType}`),
        msgBoxContent = document.querySelector(`.${boxType} .content`);

        if (window.sessionStorage.getItem("user_id")*1 === rest[0].senderID*1){
            msgBoxContent.textContent = (rest[0].accept) ? `${rest[0].receiverUsername} 接受你的好友邀請` : `${rest[0].rest[0].receiverUsername} 拒絕你的好友邀請`;
        }

        if (window.sessionStorage.getItem("user_id")*1 === rest[0].receiverID*1){
            msgBoxContent.textContent = (rest[0].accept) ? `你與 ${rest[0].senderUsername} 已結為好友` : `你已拒絕 ${rest[0].senderUsername} 的好友邀請`;
        }
        
        msgBox.style.display = "block";
        return
    }
}