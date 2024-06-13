let alertBtn = document.querySelector(".alert button");
alertBtn.addEventListener("click", () => {
    let data = {
        sender_sid: window.sessionStorage.getItem("sid"),
        receiver_sid: document.querySelector(".alert input[name=sid]").value,
        msg: document.querySelector(".alert input[name=msg]").value
    };

    socket.emit("alert", data);
})

socket.on("alert", (data) => {
    let//
    prompt = document.querySelector(".prompt"),
    content = document.querySelector(".prompt .content");

    content.textContent = `Do you want to receive msg from ${data.sender_sid}`;
    prompt.style.display = "block";

    let//
    yesBtn = document.querySelector(".yes"),
    noBtn = document.querySelector(".no");

    noBtn.addEventListener("click", () => {
        content.textContent = "";
        prompt.style.display = "none";
    })

    yesBtn.addEventListener("click", () => {
        let//
        alertDiv = document.querySelector(".alert"),
        msgDiv = document.createElement("div");

        msgDiv.textContent = data.msg;
        alertDiv.appendChild(msgDiv);

        content.textContent = "";
        prompt.style.display = "none";
    })
})


// -------- msg test for room -------
// test leave team for alert message
let msgleaveTeamBtn = document.querySelector("div.alert button.leave");
msgleaveTeamBtn.addEventListener("click", ()=> {
    // switch to main pannel
    friendsPannel.style.display = "none";
    teamsPannel.style.display = "none";
    trackingPannel.style.display = "none";
    mainPannel.style.display = "none";

    // change elements in setting div
    config.style.display = "none";
    logout.style.display = "none";
    leave.style.display = "none";

    // organize data for emitted to event listener "leave_team" on server
    let data = {
        team_id: `${window.sessionStorage.getItem("team_id")}`,
        username: window.sessionStorage.getItem("username"),
        user_id: window.sessionStorage.getItem("user_id"),
        email: window.sessionStorage.getItem("email")
    };
    socket.emit("leave_team", data);
    window.sessionStorage.removeItem("team_id");
})


// test alert msg emitted to room
let btnAlert = document.querySelector("button.alert");
alertBtn.addEventListener("click", ()=>{
    let//
    msg = document.querySelector("div.alert input").value,
    data = {
        team_id: `${window.sessionStorage.getItem("team_id")}`,
        msg: msg,
        user_id: window.sessionStorage.getItem('user_id'),
        username: window.sessionStorage.getItem('username'),
        email: window.sessionStorage.getItem('email'),
    };

    socket.emit("alert", data);
    console.log(`${window.sessionStorage.getItem("username")} send ${msg}`);
})

socket.on("alert", (data)=>{
    console.log(`Receive ${data.msg} from ${data.username}`);

    let//
    msg = data.msg,
    alert = document.querySelector("div.alert"),
    msgDiv = document.createElement("div");

    msgDiv.textContent = msg;
    alert.appendChild(msgDiv);
})