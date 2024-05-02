import * as DOMElements from "./DOMElements.js";

// build function for loading team list
export async function LoadTeamList(user_id) {
    try {
        let response = await fetch("/api/team", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user_id: user_id})
        });

        let result = await response.json();

        // own created teams list
        // 1. remove all
        let createdTeamList = document.querySelector(".main-pannel .create-list");
        while (createdTeamList.hasChildNodes()) {
            createdTeamList.removeChild(createdTeamList.lastChild);
        }

        // 2. create new list and event to all teams in create-list
        for ( let data of result.data.created_team) {
            let//
            item = document.createElement("div"),
            createList = document.querySelector(".create-list");

            item.setAttribute("class", "item");
            item.setAttribute("id", data.team_id);
            item.textContent = data.team_name;

            createList.appendChild(item);

            // click event
            item.addEventListener("click", function() {
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

            // onmouseover and on mouseout event
            item.addEventListener("mouseover", () => {
                item.style.backgroundColor = "rgb(186, 185, 185)"
            })
            item.addEventListener("mouseout", () => {
                item.style.backgroundColor = "rgb(235, 234, 234)"
            })
        }


        // joined teams list
        // 1. remove all
        let joinedTeamList = document.querySelector(".main-pannel .join-list");
        while (joinedTeamList.hasChildNodes()) {
            joinedTeamList.removeChild(joinedTeamList.lastChild);
        }

        // 2. creat new list
        for ( let data of result.data.joined_team) {
            let//
            item = document.createElement("div"),
            joinList = document.querySelector(".join-list");

            item.setAttribute("class", "item");
            item.setAttribute("id", data.team_id);
            item.textContent = data.team_name;

            joinList.appendChild(item);

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
        return;
    }
    catch(error){
        console.log(`Erorr in LoadTeamList : ${error}`)
        throw error
    }
}
