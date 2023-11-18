// test user's position by select position from randomPosition
let randomCoords = {
    latitude: 24.982 + Math.random()*0.006,
    longitude: 121.534 + Math.random()*0.006
};

document.querySelector("input[name=initial_position]").value = `${randomCoords.latitude}, ${randomCoords.longitude}`;