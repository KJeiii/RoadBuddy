// test user's position by select position from randomPosition
let randomCoords = {
    latitude: 24.982 + Math.random()*0.006,
    longitude: 121.534 + Math.random()*0.006
};

document.querySelector("input[name=initial_position]").value = `${randomCoords.latitude}, ${randomCoords.longitude}`;


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