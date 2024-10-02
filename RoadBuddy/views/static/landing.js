import { GetUserInitialPosition } from "./Utils/GeneralControl.js";

let startBtn = document.querySelector(".start");
startBtn.addEventListener("click", () => {
    window.location.replace("/member")
});

// ----- tracking user device position changing-----
GetUserInitialPosition();