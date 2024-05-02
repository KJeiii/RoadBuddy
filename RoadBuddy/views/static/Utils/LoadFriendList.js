import * as DOMElements from "./DOMElements.js";

// build function for loading friend list
export async function LoadFriendList(user_id) {
    try {
        let response = await fetch("/api/friend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user_id: user_id})
        });

        let result = await response.json();
        let friend_id = [];
        for ( let data of result.data) {
            // Load friend list in main pannel
            let mainPannelFriendItem = document.createElement("div");
            mainPannelFriendItem.setAttribute("class", "item");
            mainPannelFriendItem.setAttribute("id", data["user_id"]);
            mainPannelFriendItem.textContent = data.username;
            DOMElements.mainPannelFriendsList.appendChild(mainPannelFriendItem);
            
            // Load friend list in team pannel
            let//
            teamPannelFriendItem = document.createElement("div"),
            input = document.createElement("input"),
            label = document.createElement("label");

            teamPannelFriendItem.setAttribute("class", "item");
            teamPannelFriendItem.setAttribute("id", data.user_id);
            input.setAttribute("type", "checkbox");
            input.setAttribute("id", data.user_id);
            input.setAttribute("name", data.username);
            label.setAttribute("for", data.username);
            label.textContent = data.username;

            teamPannelFriendItem.appendChild(input);
            teamPannelFriendItem.appendChild(label);
            teamPannelFriendItem.style.display = "none";
            DOMElements.teamPannelFriendsList.appendChild(teamPannelFriendItem);
        }
        return;
    }
    catch(error){
        console.log(`Erorr in LoadFriendList : ${error}`)
        throw error
    }
}
    