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

function userCoordError(error) {console.log(`Error in getting user position: ${error}`)};

window.navigator.geolocation.getCurrentPosition(drawMap, userCoordError);



async function loadMap(){
    if (navigator.geolocation) {
        try {
            initialCoord = await window.navigator.geolocation.getCurrentPosition((position)=> {
                console.log(position);
                return [position.coords.latitude, position.coords.longitude];
                });
            console.log(initialCoord);
            let map = L.map('map').setView([initialCoord[0], initialCoord[1]], 30);
            const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
            let marker = L.marker([initialCoord[0], initialCoord[1]]).addTo(map);
        }
        catch(error) {
            console.log(error)
        }
    }
}


// test user's position by select position from randomPosition
let randomCoords = {
    latitude: 24.982 + Math.random()*0.006,
    longitude: 121.534 + Math.random()*0.006
};

// console.log(randomCoords);

// let map = L.map('map').setView([randomCoords.latitude, randomCoords.longitude], 30);
// const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//     }).addTo(map);
// let marker = L.marker([randomCoords.latitude, randomCoords.longitude]).addTo(map);



// if (navigator.geolocation) {
//     try {
//         window.navigator.geolocation.getCurrentPosition((position)=> {
//             console.log(position);
//             initialCoord = [position.coords.latitude, position.coords.longitude];
//             });
        
//         let map = L.map('map').setView([initialCoord[0], initialCoord[1]], 30);
//         const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             maxZoom: 19,
//             attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//             }).addTo(map);
//         let marker = L.marker([initialCoord[0], initialCoord[1]]).addTo(map);
//     }
//     catch(error) {
//         console.log(error)
//     }
// }





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