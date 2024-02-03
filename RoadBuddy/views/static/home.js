let startBtn = document.querySelector(".start");
startBtn.addEventListener("click", () => {
    window.location.replace("/member")
});

// ----- tracking user device position changing-----
let coordFromBrowser = {};
let watchCoord = window.navigator.geolocation.watchPosition(
    (position) => {
        coordFromBrowser = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
    }
);