export function AppendUserInPartnerList (userID, username, imageUrl, partnerListElement) {
    console.log(partnerListElement);
    const//
        itemDiv = document.createElement("div"),
        iconDiv = document.createElement("div"),
        usernameDiv = document.createElement("div");

    itemDiv.setAttribute("class", "item");
    itemDiv.setAttribute("id", userID);
    iconDiv.setAttribute("class", "icon");
    iconDiv.style.backgroundImage = `url(${imageUrl})`;
    usernameDiv.setAttribute("class", "username");
    usernameDiv.setAttribute("id", userID);
    usernameDiv.textContent = username;

    itemDiv.appendChild(iconDiv);
    itemDiv.appendChild(usernameDiv);
    partnerListElement.appendChild(itemDiv);
};

export function RemoveUserFromPartnerList(userID) {
    const//
        partnersList = document.querySelector(".tracking-pannel .partner-list"),
        partnerItems = document.querySelectorAll(".tracking-pannel .partner-list .item");
    for ( let item of partnerItems ) {
        const isTheUserToRemove = item.getAttribute("id")*1 === userID*1;
        isTheUserToRemove && partnersList.removeChild(item)
    }
}

export async function BuildPartnership(userID, teamID){
    let response = await fetch("/api/team", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
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