import { ControlTeamMsgBox, ShowPannelContent, SwitchPannel } from "./GeneralControl.js";

export function AddTeamClickEvent(teamItemCssSelector, ...onlineTeamArray){
    const teamList = document.querySelectorAll(teamItemCssSelector);
    if (teamItemCssSelector === ".create-list .item"){
        for (let item of teamList) {
            item.addEventListener("click", function () {
                // 1. switch to team pannel
                SwitchPannel("team");
                // 2. switch start-related content
                ShowPannelContent(".team-pannel", "start", true, {
                    pannelTitle: this.textContent,
                    teamID: this.getAttribute("id")
                });
            });
        }
    }

    if (teamItemCssSelector === ".join-list .item"){
        for ( let item of teamList) {
            // 1. Team in use
            const teamIsInUse = (onlineTeamArray[0].length === 0) ? 
                                false : 
                                onlineTeamArray[0].includes(item.getAttribute("id"));

            if (teamIsInUse) {item.addEventListener("click", function() {
                SwitchPannel("team");
                ShowPannelContent(".team-pannel", "join", true, {
                    pannelTitle: this.textContent,
                    teamID: this.getAttribute("id")
                });
                })
                continue
            }
            // 2. Team not in use
            item.addEventListener("click", function() {
                ControlTeamMsgBox(".team-join-response", "block", {teamName: this.textContent});
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