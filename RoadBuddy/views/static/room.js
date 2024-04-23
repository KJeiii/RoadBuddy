// ----- elememts -----
var//
settingOnMain = document.querySelector(".setting-on-main"),
settingOffMain = document.querySelector(".setting-off-main"),
settingOnTracking = document.querySelector(".setting-on-tracking"),
settingOffTracking = document.querySelector(".setting-off-tracking"),
// config = document.querySelector(".config"),
logout = document.querySelector(".logout"),
invite = document.querySelector(".invite"),
leave = document.querySelector(".leave"),
menu = document.querySelector(".nav-menu"),
menuTitle = document.querySelector(".nav-menu-title"),
menuList = document.querySelector(".nav-menu-list"),
toggleOn = document.querySelector(".nav-toggle-on"),
toggleOff = document.querySelector(".nav-toggle-off"),
menuFriends = document.querySelector(".nav-menu-friend"),
menuTeam = document.querySelector(".nav-menu-team"),
mainPannelFriendsOuter = document.querySelector(".main-pannel .friends-outer"),
mainPannelFriendsList = document.querySelector(".main-pannel .friends-list"),
teamPannelFriendsList = document.querySelector(".teams-pannel .friends-list"),
teamsOuter = document.querySelector(".teams-outer"),
partnersOuter = document.querySelector(".partners-outer"),
friendColorIntro = document.querySelector(".friend-color-intro"),
teamColorIntro = document.querySelector(".team-color-intro"),
pullUpFriend = document.querySelector(".main-pannel .pull-up-friend"),
dropDownFriend = document.querySelector(".main-pannel .drop-down-friend"),
pullUpTeam = document.querySelector(".main-pannel .pull-up-team"),
dropDownTeam = document.querySelector(".main-pannel .drop-down-team"),
pullUpTracking = document.querySelector(".pull-up-tracking"),
dropDownTracking = document.querySelector(".drop-down-tracking"),
addFriend = document.querySelector(".nav-add-friend"),
addTeam = document.querySelector(".nav-add-team"),
mainPannel = document.querySelector(".main-pannel"),
friendsPannel = document.querySelector(".friends-pannel"),
teamsPannel = document.querySelector(".teams-pannel"),
trackingPannel = document.querySelector(".tracking-pannel"),
closePannel = document.querySelectorAll(".close"),
searchList = document.querySelector(".search-list"),
searchIcon = document.querySelector(".search-icon"),
createTeamBtn = document.querySelector(".create-team-btn"),
startTripBtn = document.querySelector(".start-trip-btn"),
inviteTripBtn = document.querySelector(".invite-trip-btn"),
joinTripBtn = document.querySelector(".join-trip-btn");



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
async function LoadFriendList(user_id) {
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
        for ( data of result.data) {
            // Load friend list in main pannel
            let mainPannelFriendItem = document.createElement("div");
            mainPannelFriendItem.setAttribute("class", "item");
            mainPannelFriendItem.setAttribute("id", data["user_id"]);
            mainPannelFriendItem.textContent = data.username;
            mainPannelFriendsList.appendChild(mainPannelFriendItem);
            
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
            teamPannelFriendsList.appendChild(teamPannelFriendItem);
        }
        return;
    }
    catch(error){
        console.log(`Erorr in LoadFriendList : ${error}`)
        throw error
    }
}
    


// build function for loading team list
async function LoadTeamList(user_id) {
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
        for ( data of result.data.created_team) {
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
                createTeamBtn.style.display = "none";
                startTripBtn.style.display = "block";
                inviteTripBtn.style.display = "none";
                mainPannel.style.display = "none";
                teamsPannel.style.display = "flex";
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
        for ( data of result.data.joined_team) {
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
        console.log(`Erorr in LoadFriendList : ${error}`)
        throw error
    }
}



// check user status and load info when passing check
CheckUserStatus()
    .then((result) => {
        let data = result.data;
        // update main-pannel description
        let description = document.querySelector(".main-pannel .description").textContent;
        document.querySelector(".main-pannel .description").textContent = description + ` ${data.username}`;

        // cache username, user_id, email in DOM sessionStorage
        window.sessionStorage.setItem("username", data.username);
        window.sessionStorage.setItem("user_id", data.user_id);
        window.sessionStorage.setItem("email", data.email);
        window.sessionStorage.removeItem("team_id");


        // update friends list
        LoadFriendList(data.user_id);

        // update team list
        LoadTeamList(data.user_id);
        })
    .catch((error) => {
        console.log(error);
        window.location.replace("/member");
    })

// ----- declare global variables -----
var//
marker,
initialCoord,
sidArray = [],
sidReference,
markerArray = [],
ownColor = `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`,
partnersColor = {},
map;


// create callback funciton for drawing initial position on the map
function drawMap(position){
    initialCoord = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    map = L.map('map').setView([initialCoord.latitude, initialCoord.longitude], 15);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

    // marker = L.marker([initialCoord.latitude, initialCoord.longitude], {title: `${window.sessionStorage.getItem("username")}`}).addTo(map);
    // marker._icon.classList.add("my-marker");

    let markerOption = {
        color: ownColor,
        fillOpacity: 0.7
    };
    marker = L.circleMarker([initialCoord.latitude, initialCoord.longitude], markerOption).addTo(map);

    // remove all markers in markerArray to initialize
    if (markerArray.length > 0) {
        for ( let i = 0; i < markerArray.length; i++) {
            markerArray.pop();
        }
    }
    markerArray.push(marker);
};

function userCoordError(error) {console.log(`Error in drawing initial map: ${error}`)};


// test user's position by select position from randomPosition
let testCoords = {
    latitude: 24.982 + Math.random()*0.006,
    longitude: 121.534 + Math.random()*0.006
};
drawMap({
    coords: {
        latitude: testCoords.latitude,
        longitude: testCoords.longitude
    }
});


// ----- draw initial map -----
// if (window.navigator.geolocation) {
//     try {
//         window.navigator.geolocation.getCurrentPosition(drawMap, userCoordError);
//     }
//     catch(error) {console.log(`Error in getting user postion : ${error}`)}
// }



// ----- toggle down setting  -----
settingOnMain.addEventListener("click", () => {
    // config.style.display = "block";
    logout.style.display = "block";
    invite.style.display = "none";
    leave.style.display = "none";
    settingOnMain.style.display = "none";
    settingOffMain.style.display = "block";
})

settingOffMain.addEventListener("click", () => {
    // config.style.display = "none";
    logout.style.display = "none";
    invite.style.display = "none";
    leave.style.display = "none";
    settingOffMain.style.display = "none";
    settingOnMain.style.display = "block";
})

settingOnTracking.addEventListener("click", () => {
    // config.style.display = "none";
    logout.style.display = "none";
    invite.style.display = "none";
    leave.style.display = "block";
    settingOnTracking.style.display = "none";
    settingOffTracking.style.display = "block";

    if ( team_sender_info_cache === undefined  ) {
        invite.style.display = "block";
    }
})

settingOffTracking.addEventListener("click", () => {
    // config.style.display = "none";
    logout.style.display = "none";
    invite.style.display = "none";
    leave.style.display = "none";
    settingOnTracking.style.display = "block";
    settingOffTracking.style.display = "none";
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

    let isPulledUp = (mainPannel.style.top === "20vh") ? true : false;
    // switch content
    teamsOuter.style.display = "none";
    teamColorIntro.style.display = "none";
    mainPannelFriendsOuter.style.display = (isPulledUp) ? "flex" : "none";
    friendColorIntro.style.display = (isPulledUp) ? "flex" : "none";

    // switch pullup and dropdown button
    pullUpTeam.style.display = "none";
    dropDownTeam.style.display = "none";
    pullUpFriend.style.display = (isPulledUp) ? "none" : "block";
    dropDownFriend.style.display = (isPulledUp) ? "block" : "none";

    // switch add button
    addTeam.style.display = "none";
    addFriend.style.display = "block";
})

menuTeam.addEventListener("click", ()=>{
    menuTitle.textContent = menuTeam.textContent;
    menuList.style.display = "none";
    menu.style.border = "none";

    let isPulledUp = (mainPannel.style.top === "20vh") ? true : false;
    // switch content

    mainPannelFriendsOuter.style.display = "none";
    friendColorIntro.style.display = "none";
    teamsOuter.style.display = (isPulledUp) ? "flex" : "none";
    teamColorIntro.style.display = (isPulledUp) ? "flex" : "none";

    // switch pullup and dropdown button
    pullUpFriend.style.display = "none";
    dropDownFriend.style.display = "none";
    pullUpTeam.style.display = (isPulledUp) ? "none" : "block";
    dropDownTeam.style.display = (isPulledUp) ? "block" : "none";

    // switch add button
    addTeam.style.display = "block";
    addFriend.style.display = "none";

})



// ----- add friend page-----
addFriend.addEventListener("click", () => {
    friendsPannel.style.display = "flex";
    mainPannel.style.display = "none";
})



// ----- add team page-----
addTeam.addEventListener("click", () => {
    teamsPannel.style.display = "flex";
    mainPannel.style.display = "none";
    document.querySelectorAll(".teams-pannel .pannel-title")[1].style.display = "none";
    document.querySelector(".teams-pannel .friends-outer").style.display = "none";
})

createTeamBtn.addEventListener("click", () => {
    let searchInput = document.querySelector("input[name=create-team]");
    searchInput.setAttribute("placeholder", "請輸入隊伍名稱");

    if (searchInput.value === "" ) {
        searchInput.setAttribute("placeholder", "請輸入隊伍名稱");
        return
    }

    fetch("/api/team", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            team_name: searchInput.value,
            user_id: window.sessionStorage.getItem("user_id")
        })
    })
    .then((response) => {return response.json()})
    .then((result) => {

        if ( result.error ) {
            searchInput.value = "";
            searchInput.setAttribute("placeholder", "隊伍名稱已被使用，請輸入其他名稱");
            return
        }

        let//
        createList = document.querySelector(".create-list"),
        joinList = document.querySelector(".join-list");

        while ( createList.hasChildNodes() ) {
            createList.removeChild(createList.lastChild)
        }

        // while ( joinList.hasChildNodes() ) {
        //     joinList.removeChild(joinList.lastChild)
        // }

        LoadTeamList(window.sessionStorage.getItem("user_id"));

        teamsPannel.style.display = "none";
        mainPannel.style.display = "block";
        document.querySelectorAll(".teams-pannel .pannel-title")[1].style.display = "block";
        document.querySelector(".teams-pannel .friends-outer").style.display = "block";

        // response when creation succeed
        let//
        teamCreateResponse = document.querySelector(".team-create-response"),
        content = document.querySelector(".team-create-response .content");
        content.textContent = `你已建立隊伍 ${searchInput.value}`;
        teamCreateResponse.style.display = "block";
        mainPannel.style.top = "65vh";

    })
    .catch((error) => {console.log(`Error in creating team : ${error}`)})
})


// close team-create-response when click ok
let createOkBtn = document.querySelector(".team-create-response button");
createOkBtn.addEventListener("click", () => {
    let//
    teamCreateResponse = document.querySelector(".team-create-response"),
    content = document.querySelector(".team-create-response .content");
    teamCreateResponse.style.display = "none";
    content.textContent = ``;
})


// ----- close pannel ----
for (close of closePannel) {
    close.addEventListener("click", () => {
        // back to main pannel
        friendsPannel.style.display = "none";
        teamsPannel.style.display = "none";
        mainPannel.style.display = "block";
        document.querySelectorAll(".teams-pannel .pannel-title")[1].style.display = "block";;
        document.querySelector(".teams-pannel .friends-outer").style.display = "block";

        // teams-pannel recover
        document.querySelector(".teams-pannel .pannel-title").textContent = "創建隊伍";
        document.querySelector(".friends-outer").style.height = "40%";
        document.querySelector(".teams-pannel .search").style.display = "flex";
        createTeamBtn.style.display = "block";
        startTripBtn.style.display = "none";
        while (searchList.hasChildNodes()) {
            searchList.removeChild(searchList.lastChild)
        }
    })
};


// ----- pull up and drop down main pannel and tracking pannel ------
pullUpFriend.addEventListener("click", () => {
    pullUpFriend.style.display = "none";
    dropDownFriend.style.display = "block";
    mainPannel.style.top = "20vh";
    mainPannel.style.height = "80vh";
    friendColorIntro.style.display = "flex";
    mainPannelFriendsOuter.style.display = "flex";
})

dropDownFriend.addEventListener("click", () => {
    dropDownFriend.style.display = "none";
    pullUpFriend.style.display = "block";
    mainPannel.style.top = "70vh";
    mainPannel.style.height = "30vh";
    friendColorIntro.style.display = "none";
    mainPannelFriendsOuter.style.display = "none";
})

pullUpTeam.addEventListener("click", () => {
    pullUpTeam.style.display = "none";
    dropDownTeam.style.display = "block";
    mainPannel.style.top = "20vh";
    mainPannel.style.height = "80vh";
    teamColorIntro.style.display = "flex";
    teamsOuter.style.display = "flex";
})

dropDownTeam.addEventListener("click", () => {
    dropDownTeam.style.display = "none";
    pullUpTeam.style.display = "block";
    mainPannel.style.top = "70vh";
    mainPannel.style.height = "30vh";
    teamColorIntro.style.display = "none";
    teamsOuter.style.display = "none";
})


// ----- pull up and drop down tracking pannel ------
pullUpTracking.addEventListener("click", () => {
    pullUpTracking.style.display = "none";
    dropDownTracking.style.display = "block";
    trackingPannel.style.top = "20vh";
    trackingPannel.style.height = "80vh";
})

dropDownTracking.addEventListener("click", () => {
    dropDownTracking.style.display = "none";
    pullUpTracking.style.display = "block";
    trackingPannel.style.top = "70vh";
    trackingPannel.style.height = "30vh";
})



// ----- build function for searching new friend -----
async function Search_new_friend(username) {
    let response = await fetch("/api/friend/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username: username})
    });

    let result = await response.json();

    for (data of result.data) {
        let item = document.createElement("div"),
        input = document.createElement("input"),
        label = document.createElement("label");

        item.setAttribute("class", "item")

        input.setAttribute("type", "checkbox");
        input.setAttribute("id", data.user_id);
        input.setAttribute("name", data.username);
        label.setAttribute("for", data.username);
        label.textContent = data.username;

        item.appendChild(input);
        item.appendChild(label);
        searchList.appendChild(item);
    }
}

searchIcon.addEventListener("click", () => {
    let searchInput = document.querySelector("input[name=search-friend]");
    searchInput.setAttribute("placeholder", "搜尋姓名");

    while (searchList.hasChildNodes()) {
        searchList.removeChild(searchList.lastChild)
    }

    if ( searchInput.value === "" ) {
        searchInput.setAttribute("placeholder", "請填入姓名");
        return
    }

    let username = document.querySelector("input[name=search-friend]").value;
    Search_new_friend(username);
})

