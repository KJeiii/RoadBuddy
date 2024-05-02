import * as DOMElements from "../Utils/DOMElements.js";

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