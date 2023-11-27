// draw initial position on the map
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



// ----- switch menu -----
let//
menu = document.querySelector(".nav-menu"),
menuTitle = document.querySelector(".nav-menu-title"),
menuList = document.querySelector(".nav-menu-list"),
toggleIcon = document.querySelector(".nav-toggle"),
menuFriends = document.querySelector(".nav-menu-friend"),
menuTeam = document.querySelector(".nav-menu-team"),
friendsList = document.querySelector(".friends-list"),
teamsList = document.querySelector(".teams-list"),
addFriend = document.querySelector(".nav-add-friend"),
addTeam = document.querySelector(".nav-add-team");

toggleIcon.addEventListener("click", ()=>{
    menu.style.border = "0.5px solid rgb(151, 150, 150)";
    menuList.style.display = "block";

})

menuFriends.addEventListener("click", ()=>{
    menuTitle.textContent = menuFriends.textContent;
    menuList.style.display = "none";
    menu.style.border = "none";
    teamsList.style.display = "none";
    addTeam.style.display = "none";
    friendsList.style.display = "block";
    addFriend.style.display = "block";
    

})

menuTeam.addEventListener("click", ()=>{
    menuTitle.textContent = menuTeam.textContent;
    menuList.style.display = "none";
    menu.style.border = "none";
    friendsList.style.display = "none";
    addFriend.style.display = "none";
    teamsList.style.display = "block";
    addTeam.style.display = "block";
})



// ----- add friend -----
addFriend.addEventListener("click", () => {
    console.log("add friends");
})



// ----- add team -----
addTeam.addEventListener("click", () => {
    console.log("add team")
})






// if (window.navigator.geolocation) {
//     try {
//         window.navigator.geolocation.getCurrentPosition(drawMap, userCoordError);
//         console.log("check in initialize map")
//     }
//     catch(error) {console.log(`Error in getting user postion : ${error}`)}
// }



// function initializeMap() {
//     return new Promise((resolve, reject) => {
//         if (window.navigator.geolocation) {
//             try {
//                 window.navigator.geolocation.getCurrentPosition(drawMap, userCoordError);
//                 console.log("check in initialize map")
//                 resolve();
//             }
//             catch(error) {console.log(`Error in getting user postion : ${error}`)}
//         }
//     })
// }


// async function loadPage() {
//     initializeMap()
//         .then(() => {console.log("test")})
//         .then(() => {
//             console.log("test");
//             // add pannel div
//             let pannelDiv = document.createElement("div");
//             pannelDiv.setAttribute("class", "pannel");
//             document.querySelector(".background").append(pannelDiv);
//         })
//         .then(() => console.log("Done"))
//         .catch((error) => console.log(error))
// }

// loadPage()













// document.querySelector("input[name=initial_position]").value = `${randomCoords.latitude}, ${randomCoords.longitude}`;


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
