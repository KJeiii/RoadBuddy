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
mainPannelFriendsOuter = document.querySelector(".main-pannel .friends-outer"),
mainPannelFriendsList = document.querySelector(".main-pannel .friends-list"),
teamPannelFriendsList = document.querySelector(".teams-pannel .friends-list"),
teamsOuter = document.querySelector(".teams-outer"),
pullUp = document.querySelector(".pull-up"),
dropDown = document.querySelector(".drop-down"),
addFriend = document.querySelector(".nav-add-friend"),
addTeam = document.querySelector(".nav-add-team"),
mainPannel = document.querySelector(".main-pannel"),
friendsPannel = document.querySelector(".friends-pannel"),
teamsPannel = document.querySelector(".teams-pannel"),
closePannel = document.querySelectorAll(".close"),
searchList = document.querySelector(".search-list"),
searchIcon = document.querySelector(".search-icon"),
createTeamBtn = document.querySelector(".create-team-btn"),
startTripBtn = document.querySelector(".start-trip-btn");



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

        for ( data of result.data) {
            // Load friend list in main pannel
            let mainPannelFriendItem = document.createElement("div");
            mainPannelFriendItem.setAttribute("class", "item");
            mainPannelFriendItem.textContent = data.username;
            mainPannelFriendsList.appendChild(mainPannelFriendItem);
            
            // Load friend list in team pannel
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

        // own created teams
        for ( data of result.data.created_team) {
            let//
            item = document.createElement("div"),
            createList = document.querySelector(".create-list");

            item.setAttribute("class", "item");
            item.setAttribute("id", data.team_id);
            item.textContent = data.team_name;

            createList.appendChild(item);
        }

        // joined teams as a partner
        for ( data of result.data.joined_team) {
            let//
            item = document.createElement("div"),
            joinList = document.querySelector(".join-list");

            item.setAttribute("class", "item");
            item.setAttribute("id", data.team_id);
            item.textContent = data.team_name;

            joinList.appendChild(item);
        }

        // add event to all teams
        let teamItems = document.querySelectorAll(".teams-outer .item");
        for ( item of teamItems ) {
            item.addEventListener("click", function() {
                document.querySelector(".teams-pannel .pannel-title").textContent = this.textContent;
                document.querySelector(".teams-pannel .pannel-title").setAttribute("id", this.getAttribute("id"));
                document.querySelector(".teams-pannel .search").style.display = "none";
                document.querySelector(".friends-outer").style.height = "55%";
                createTeamBtn.style.display = "none";
                startTripBtn.style.display = "block";
                mainPannel.style.display = "none";
                teamsPannel.style.display = "flex";
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


        // update friends list
        LoadFriendList(data.user_id);

        // update team list
        LoadTeamList(data.user_id);
        })
    .catch((error) => {
        console.log(error);
        window.location.replace("/member");
    })


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



// ----- draw initial map -----
if (window.navigator.geolocation) {
    try {
        window.navigator.geolocation.getCurrentPosition(drawMap, userCoordError);
        console.log("check in initialize map")
    }
    catch(error) {console.log(`Error in getting user postion : ${error}`)}
}



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
    teamsOuter.style.display = "none";
    addTeam.style.display = "none";
    mainPannelFriendsOuter.style.display = "flex";
    addFriend.style.display = "block";
})

menuTeam.addEventListener("click", ()=>{
    menuTitle.textContent = menuTeam.textContent;
    menuList.style.display = "none";
    menu.style.border = "none";
    mainPannelFriendsOuter.style.display = "none";
    addFriend.style.display = "none";
    teamsOuter.style.display = "flex";
    addTeam.style.display = "block";
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

        while ( joinList.hasChildNodes() ) {
            joinList.removeChild(joinList.lastChild)
        }

        LoadTeamList(window.sessionStorage.getItem("user_id"));
        teamsPannel.style.display = "none";
        mainPannel.style.display = "block";
    })
    .catch((error) => {console.log(`Error in creating team : ${error}`)})
})


// ----- close pannel ----
for (close of closePannel) {
    close.addEventListener("click", () => {
        // back to main pannel
        friendsPannel.style.display = "none";
        teamsPannel.style.display = "none";
        mainPannel.style.display = "block";

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


// ----- pull up and drop down main pannel ------
pullUp.addEventListener("click", () => {
    pullUp.style.display = "none";
    dropDown.style.display = "block";
    mainPannel.style.top = "20vh";
})

dropDown.addEventListener("click", () => {
    dropDown.style.display = "none";
    pullUp.style.display = "block";
    mainPannel.style.top = "65vh";
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



// ----- start tracking ----- 
// startTripBtn.addEventListener("click", () => {
//     let//
//     team_id = document.querySelector(".teams-pannel .pannel-title").getAttribute("id"),
//     team_name = document.querySelector(".teams-pannel .pannel-title").textContent;

//     window.sessionStorage.setItem("team_id", team_id);
//     window.sessionStorage.setItem("team_name", team_name);

//     window.location.replace("/tracking");

// })

