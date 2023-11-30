// build function for checking user status
async function CheckUserStatus() {
    let jwt = window.localStorage.getItem("token");
    console.log(jwt);

    try{
        if ( jwt === null) {throw {"ok":false, "data": null}}

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

CheckUserStatus()
    .then((result) => {window.location.replace("/room")})
    .catch((error) => {console.log(`Error from CheckUserStatus in member page : ${error}`)})

    
// ----- switch sigup/login page -----
let//
signupDiv = document.querySelector(".title-signup"),
loginDiv = document.querySelector(".title-login");

signupDiv.addEventListener("click", () => {
    let//
    signupForm = document.querySelector(".signup"),
    loginForm = document.querySelector(".login");

    signupForm.style.display = "flex";
    loginForm.style.display = "none";
});

loginDiv.addEventListener("click", () => {
    let//
    signupForm = document.querySelector(".signup"),
    loginForm = document.querySelector(".login"),
    loginBtn = document.querySelector(".login-btn");

    signupForm.style.display = "none";
    loginBtn.style.backgroundColor = "rgba(83,186,190,0.5)";
    loginForm.style.display = "flex";
});


// ----- submit user information when click signup/login button -----
let//
signupBtn = document.querySelector(".signup-btn"),
loginBtn = document.querySelector(".login-btn");

let addErrorMsg = (cssSelector, msgText) => {
    let//
    inputTitle = document.querySelector(cssSelector),
    msg = document.createElement("div");
    msg.textContent = msgText;
    msg.style.color = "red";
    msg.style.fontSize = "15px";
    msg.style.lineHeight = "30px";
    msg.style.marginLeft = "10px";
    inputTitle.appendChild(msg)
}

// --- signup ---
signupBtn.addEventListener("click", async() => {
    let//
    emailInput = document.querySelector(".signup input[name=email]"),
    usernameInput = document.querySelector(".signup input[name=username]"),
    passwordInput = document.querySelector(".signup input[name=password]"),
    confirmInput = document.querySelector(".signup input[name=confirm-password]");
    
    // feedback error message when one of the inputs is empty
    for ( input of [emailInput, usernameInput, passwordInput, confirmInput] ) {
        if  (input.value === "") {
            input.setAttribute("placeholder", "此欄位不可空白");
            input.style.border = "2px solid rgb(255, 197, 197)";
            return;
        }
    }

    // check email format by identify "@"
    if ( emailInput.value.includes("@") != true ) {
        addErrorMsg(".signup .email", "(格式錯誤，須包含@)");
        return;
    }

    // check if password is confirmed correctly
    if ( passwordInput.value !== confirmInput.value ) {
        addErrorMsg(".signup .confirm-password", "(兩次密碼不一致，請重新輸入)");
        return;
    }

    // request signup information to api
    try{
        let response = await fetch("/api/member", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailInput.value,
                username: usernameInput.value,
                password: passwordInput.value
            })
        });
        let result = await response.json();

        if (response.status !== 200) {
            addErrorMsg(".signup .email", result.message);
            console.log(result.message);
            return;
        }

        console.log(result.message);
    }
    catch(error) {
        console.log(error)
    }

});

// --- login ---
loginBtn.addEventListener("click", async() => {
    let//
    emailInput = document.querySelector(".login input[name=email]"),
    passwordInput = document.querySelector(".login input[name=password]");
    
    // feedback error message when one of the inputs is empty
    for ( input of [emailInput, passwordInput] ) {
        if  (input.value === "") {
            input.setAttribute("placeholder", "此欄位不可空白");
            input.style.border = "2px solid rgb(255, 197, 197)";
            return;
        }
    }

    // check if user has signed up already by email
    // check if password is correct
    try {
        let response = await fetch("/api/member/auth", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value
            })
        });

        let result = await response.json();
        console.log(result);

        if (response.status === 400) {
            let msg = result.message;
            if ( msg.includes("電子信件") ) {
                addErrorMsg(".login .email", result.message);
                return;
            }
            else{
                addErrorMsg(".login .password", result.message);
                return;
            }
        }
        
        let jwt = result.token;
        window.localStorage.setItem("token", jwt);
        window.location.replace("/room");

    }
    catch(error) {
        console.log(error)
    }

});