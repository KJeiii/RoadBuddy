// ----- elememts -----
var//
settingOn = document.querySelector(".setting-on"),
settingOff = document.querySelector(".setting-off"),
config = document.querySelector(".config"),
logout = document.querySelector(".logout"),
menu = document.querySelector(".nav-menu"),
menuTitle = document.querySelector(".nav-menu-title"),
menuList = document.querySelector(".nav-menu-list"),
toggleOn = document.querySelector(".nav-toggle-on"),
toggleOff = document.querySelector(".nav-toggle-off"),
menuFriends = document.querySelector(".nav-menu-friend"),
menuTeam = document.querySelector(".nav-menu-team"),
mainPannelFriendsList = document.querySelector(".main-pannel .friends-list"),
teamPannelFriendsList = document.querySelector(".teams-pannel .friends-list"),
teamsList = document.querySelector(".teams-list"),
pullUp = document.querySelector(".pull-up"),
dropDown = document.querySelector(".drop-down"),
addFriend = document.querySelector(".nav-add-friend"),
addTeam = document.querySelector(".nav-add-team"),
mainPannel = document.querySelector(".main-pannel"),
friendsPannel = document.querySelector(".friends-pannel"),
teamsPannel = document.querySelector(".teams-pannel"),
closePannel = document.querySelectorAll(".close");


// build function for checking user status
async function CheckUserStatus() {
    let jwt = window.localStorage.getItem("token");

    try{
        if ( jwt === null) {return {"ok":false, "data": null}}

        let//
        response = await fetch("/api/member/auth", {
            method: "GET",
            headers: {"authorization": `Bearer ${jwt}`}
        }),
        result = await response.json();

        if (result.data === null) {return {"ok": false, "data": null}}

        let data = {
            user_id: result.user_id,
            username: result.username,
            email: result.email
        }
        return {"ok": true, "data": data}
    }
    catch(error) {
        console.log(`Error in CheckUserStatus : ${error}`)
        throw error
    }
}


// build function for loading friend list
async function LoadFriendsList(user_id) {
    try {
        let response = await fetch("/api/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user_id: user_id})
        });

        let result = await response.json();

        for ( data of result.data) {
            let mainPannelFriendItem = document.createElement("div");
            mainPannelFriendItem.setAttribute("class", "item");
            mainPannelFriendItem.textContent = data.username;
            mainPannelFriendsList.appendChild(mainPannelFriendItem);

            let//
            teamPannelFriendItem = document.createElement("div"),
            input = document.createElement("input"),
            label = document.createElement("label");

            teamPannelFriendItem.setAttribute("class", "item");
            input.setAttribute("type", "checkbox");
            input.setAttribute("id", data.user_id);
            input.setAttribute("name", data.username);
            label.setAttribute("for", data.username);
            label.textContent = data.username;

            teamPannelFriendItem.appendChild(input);
            teamPannelFriendItem.appendChild(label);
            teamPannelFriendsList.appendChild(teamPannelFriendItem);
        }
        return;
    }
    catch(error){
        console.log(`Erorr in LoadFriendList : ${error}`)
        throw error
    }
}
    

// check user status and load info when passing check
CheckUserStatus()
    .then((result) => {
        let data = result.data;
        // adjust main-pannel description
        let description = document.querySelector(".main-pannel .description").textContent;
        document.querySelector(".main-pannel .description").textContent = description + ` ${data.username}`;

        // adjust friends list
        LoadFriendsList(data.user_id);
        })
    .catch((error) => {console.log(error)})



// create callback funciton for drawing initial position on the map
function drawMap(position){
    let initialCoord = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };

    let map = L.map('map').setView([initialCoord.latitude, initialCoord.longitude], 15);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    let marker = L.marker([initialCoord.latitude, initialCoord.longitude]).addTo(map);
};


function userCoordError(error) {console.log(`Error in drawing initial map: ${error}`)};



// ----- toggle down setting  -----
settingOn.addEventListener("click", () => {
    config.style.display = "block";
    logout.style.display = "block";
    settingOn.style.display = "none";
    settingOff.style.display = "block";
})

settingOff.addEventListener("click", () => {
    config.style.display = "none";
    logout.style.display = "none";
    settingOff.style.display = "none";
    settingOn.style.display = "block";
})

// ----- logout -----
logout.addEventListener("click", () => {
    window.localStorage.removeItem("token");
    window.location.replace("/member");
})


// ----- switch menu -----
toggleOn.addEventListener("click", ()=>{
    menu.style.border = "0.5px solid rgb(151, 150, 150)";
    menuList.style.display = "block";
    toggleOn.style.display = "none";
    toggleOff.style.display = "block";
})

toggleOff.addEventListener("click", ()=>{
    menu.style.border = "none";
    menuList.style.display = "none";
    toggleOff.style.display = "none";
    toggleOn.style.display = "block";
})

menuFriends.addEventListener("click", ()=>{
    menuTitle.textContent = menuFriends.textContent;
    menuList.style.display = "none";
    menu.style.border = "none";
    teamsList.style.display = "none";
    addTeam.style.display = "none";
    mainPannelFriendsList.style.display = "grid";
    addFriend.style.display = "block";
})

menuTeam.addEventListener("click", ()=>{
    menuTitle.textContent = menuTeam.textContent;
    menuList.style.display = "none";
    menu.style.border = "none";
    mainPannelFriendsList.style.display = "none";
    addFriend.style.display = "none";
    teamsList.style.display = "grid";
    addTeam.style.display = "block";
})



// ----- add friend -----
addFriend.addEventListener("click", () => {
    console.log("add friends");
    friendsPannel.style.display = "flex";
    mainPannel.style.display = "none";
})



// ----- add team -----
addTeam.addEventListener("click", () => {
    console.log("add team");
    teamsPannel.style.display = "flex";
    mainPannel.style.display = "none";
})


// ----- use old team -----
let oldTeam = document.querySelectorAll(".teams-list .item");
for (team of oldTeam) {
    team.addEventListener("click", () => {
        let oldTeamName = team.textContent;
        document.querySelector(".teams-pannel .pannel-title").textContent = oldTeamName;
        document.querySelector(".teams-pannel .search").style.display = "none";
        document.querySelector(".friends-outer").style.height = "55%";
        teamsPannel.style.display = "flex";
    })
}


// ----- close pannel ----
for (close of closePannel) {
    close.addEventListener("click", () => {
        friendsPannel.style.display = "none";
        teamsPannel.style.display = "none";
        mainPannel.style.display = "block";
        document.querySelector(".teams-pannel .pannel-title").textContent = "創建隊伍";
        document.querySelector(".friends-outer").style.height = "40%";
        document.querySelector(".teams-pannel .search").style.display = "flex";

    })
};


// ----- pull up and drop down main pannel ------
pullUp.addEventListener("click", () => {
    pullUp.style.display = "none";
    dropDown.style.display = "block";
    mainPannel.style.top = "40vh";
})

dropDown.addEventListener("click", () => {
    dropDown.style.display = "none";
    pullUp.style.display = "block";
    mainPannel.style.top = "65vh";
})



// ----- draw initial map -----
if (window.navigator.geolocation) {
    try {
        window.navigator.geolocation.getCurrentPosition(drawMap, userCoordError);
        console.log("check in initialize map")
    }
    catch(error) {console.log(`Error in getting user postion : ${error}`)}
}


// storage username and roomID on browser session
let createBtn = document.querySelector("button[name=create]");
createBtn.addEventListener("click", () => {
    let//
    username = document.querySelector("input[name=username]").value,
    roomID = document.querySelector("input[name=roomID]").value;
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("roomID", roomID);
});

let joinBtn = document.querySelector("button[name=join]");
joinBtn.addEventListener("click", () => {
    let//
    username = document.querySelector("input[name=username]").value,
    roomID = document.querySelector("input[name=roomID]").value;
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("roomID", roomID);
});


// test user's position by select position from randomPosition
let randomCoords = {
    latitude: 24.982 + Math.random()*0.006,
    longitude: 121.534 + Math.random()*0.006
};
