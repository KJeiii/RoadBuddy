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
    partnersList = document.querySelector(".tracking-pannel .partners-list");
    partnerItems = document.querySelectorAll(".tracking-pannel .partners-list .item");

    for ( let item of partnerItems ) {
        if ( item.getAttribute("id")*1 === user_id*1 ) {
            partnersList.removeChild(item);
        }
    }
}
