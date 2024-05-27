import * as DOMElements from "./DOMElements.js";
import { ControlTeamMsgBox, ShowPannelContent, SwitchPannel } from "./GeneralControl.js";

export function AddTeamClickEvent(teamItemCssSelector, ...onlineTeamArray){
    const teamList = document.querySelectorAll(teamItemCssSelector);
    if (teamItemCssSelector === ".create-list .item"){
        for (let item of teamList) {
            item.addEventListener("click", function () {
                // 1. 切換到team pannel > SwithcPannel()
                SwitchPannel("team");
                // 2. 切換team pannel content: 標題、 > ShowPannelContent()
                ShowPannelContent(".team-pannel", "start", true, {
                    pannelTitle: this.textContent,
                    teamID: this.getAttribute("id")
                });

                // document.querySelector(".team-pannel .pannel-title").textContent = this.textContent;
                // document.querySelector(".team-pannel .pannel-title").setAttribute("id", this.getAttribute("id"));
                // document.querySelector(".team-pannel .search").style.display = "none";
                // document.querySelector(".friend-outer").style.height = "55%";
                // DOMElements.createTeamBtn.style.display = "none";
                // DOMElements.startTripBtn.style.display = "block";
                // DOMElements.inviteTripBtn.style.display = "none";
                // DOMElements.mainPannel.style.display = "none";
                // DOMElements.teamPannel.style.display = "flex";
            });
        }
    }

    if (teamItemCssSelector === ".join-list .item"){
        for ( let item of teamList) {
            // 1. Team in use
            const teamIsInUse = (onlineTeamArray[0].length === 0) ? 
                                false : 
                                onlineTeamArray[0].includes(item.getAttribute("id"));

            if (teamIsInUse) {
                item.addEventListener("click", function() {
                    SwitchPannel("team");
                    ShowPannelContent(".team-pannel", "join", true, {
                        pannelTitle: this.textContent,
                        teamID: this.getAttribute("id")
                    });
                    // document.querySelector(".team-pannel .pannel-title").textContent = this.textContent;
                    // document.querySelector(".team-pannel .pannel-title").setAttribute("id", this.getAttribute("id"));
                    // document.querySelector(".team-pannel .friend-title").style.display = "none";
                    // document.querySelector(".team-pannel .search").style.display = "none";
                    // document.querySelector(".team-pannel .friend-outer").style.display = "none";
                    // DOMElements.teamPannel.style.top = "65vh";
                    // DOMElements.mainPannel.style.display = "none";
                    // DOMElements.teamPannel.style.display = "flex";
                    // DOMElements.dropDownMain.style.display = "block";
                    // DOMElements.pullUpMain.style.display = "none";
                    // DOMElements.createTeamBtn.style.display = "none";
                    // DOMElements.startTripBtn.style.display = "none";
                    // DOMElements.inviteTripBtn.style.display = "none";
                    // DOMElements.joinTripBtn.style.display = "block";
                })
                continue
            }
            // 2. Team not in use
            item.addEventListener("click", function() {
                // ControlTeamMsgBox(".team-join-response", "block")
                let//
                teamCreateResponse = document.querySelector(".team-join-response"),
                content = document.querySelector(".team-join-response .content");
                content.textContent = `${this.textContent}的擁有者，尚未啟程`;
                teamCreateResponse.style.display = "block";
                DOMElements.mainPannel.style.top = "65vh";
                DOMElements.dropDownMain.style.display = "none";
                DOMElements.pullUpMain.style.display = "block";
            })
        }
    }
}

export function AddTeamHoverEvent(teamItemCssSelector){
    const teamList = document.querySelectorAll(teamItemCssSelector);
    if (teamItemCssSelector === ".create-list .item"){
        for (let item of teamList) {
            item.addEventListener("mouseover", () => {
                item.style.backgroundColor = "rgb(186, 185, 185)"
            })
            item.addEventListener("mouseout", () => {
                item.style.backgroundColor = "rgb(235, 234, 234)"
            })
        }
    }

    if (teamItemCssSelector === ".join-list .item"){
        for (let item of teamList) {
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


// export function AddEventsToTeamItems(teamType) {
//     if (teamType === "created") {
//         let createdTeamList = document.querySelectorAll(".create-list .item");

//         // click event
//         for (let item of createdTeamList) {
//             item.addEventListener("click", function () {
//                 document.querySelector(".teams-pannel .pannel-title").textContent = this.textContent;
//                 document.querySelector(".teams-pannel .pannel-title").setAttribute("id", this.getAttribute("id"));
//                 document.querySelector(".teams-pannel .search").style.display = "none";
//                 document.querySelector(".friend-outer").style.height = "55%";
//                 DOMElements.createTeamBtn.style.display = "none";
//                 DOMElements.startTripBtn.style.display = "block";
//                 DOMElements.inviteTripBtn.style.display = "none";
//                 DOMElements.mainPannel.style.display = "none";
//                 DOMElements.teamsPannel.style.display = "flex";
//             });

//             // mouseover and mouseout event
//             item.addEventListener("mouseover", () => {
//                 item.style.backgroundColor = "rgb(186, 185, 185)"
//             })
//             item.addEventListener("mouseout", () => {
//                 item.style.backgroundColor = "rgb(235, 234, 234)"
//             })
//         }
//     }
//     if (teamType === "joined") {
//         let joinedTeamList = document.querySelectorAll(".join-list .item");
//         for (let item of joinedTeamList) {
//             // onmouseover and on mouseout event
//             item.addEventListener("mouseover", () => {
//                 let overBackgroundColor = (item.style.border === "3px solid rgb(182, 181, 181)") ? "rgb(186, 185, 185)" : "rgb(22, 166, 6)";
//                 item.style.backgroundColor = overBackgroundColor;
//             })
//             item.addEventListener("mouseout", () => {
//                 let outBackgroundColor = (item.style.border === "3px solid rgb(182, 181, 181)") ? "rgb(235, 234, 234)" : "rgb(182, 232, 176)";
//                 item.style.backgroundColor = outBackgroundColor;
//             })
//         }
//     }
// }