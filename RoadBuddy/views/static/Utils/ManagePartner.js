export function appendPartner (user_id, container, reference) {
    let//
    item = document.createElement("div"),
    icon = document.createElement("div"),
    username = document.createElement("div");

    item.setAttribute("class", "item");
    item.setAttribute("id", user_id);
    icon.setAttribute("class", "icon");
    icon.style.backgroundColor = reference[user_id].color;
    username.setAttribute("class", "username");
    username.setAttribute("id", user_id);
    username.textContent = reference[user_id].username;

    item.appendChild(icon);
    item.appendChild(username);
    container.appendChild(item);
};

export function removePartner(user_id) {

    let//
    partnersList = document.querySelector(".tracking-pannel .partner-list"),
    partnerItems = document.querySelectorAll(".tracking-pannel .partner-list .item");

    for ( let item of partnerItems ) {
        if ( item.getAttribute("id")*1 === user_id*1 ) {
            partnersList.removeChild(item);
        }
    }
}

export async function BuildPartnership(userID, teamID){
    let response = await fetch("/api/team", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            team_id: teamID,
            user_id: userID
        })
    });

    let result = await response.json();
    if (!result.ok) {
        throw result.message;
    }
    return result
}

export function UpdatePartnersColor(partnersColorObject, userIDAndNamePairs, ...rest){
    userIDAndNamePairs.forEach(user => {
        const partnerColor = (user.id === window.sessionStorage.getItem("user_id")*1) ? 
                            (rest[0]) : 
                            (`rgb(
                                ${Math.floor(Math.random()*255)}, 
                                ${Math.floor(Math.random()*255)}, 
                                ${Math.floor(Math.random()*255)}
                            )`);
        partnersColorObject[user.id] = {
        username: user.name,
        color: partnerColor
        };
    });
}