import { CheckUserStatus } from "./Utils/ManageUser.js";

CheckUserStatus()
    .then((result) => {
        if (result.ok) {
            window.location.replace("/main");
        }
    })
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
    
    let emailTitle = document.querySelector(".signup .email");
    while ( emailTitle.childNodes.length > 2 ) {
        emailTitle.removeChild(emailTitle.lastChild)
    }

    let passwordTitle = document.querySelector(".signup .confirm-password");
    while ( passwordTitle.childNodes.length > 2 ) {
        passwordTitle.removeChild(passwordTitle.lastChild)
    }

    // feedback error message when one of the inputs is empty
    for ( let input of [emailInput, usernameInput, passwordInput, confirmInput] ) {
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
        
        let//
        signupForm = document.querySelector(".signup"),
        loginForm = document.querySelector(".login"),
        loginBtn = document.querySelector(".login-btn"),
        loginMailInput = document.querySelector(".login input[name=email]");
    
        signupForm.style.display = "none";
        loginMailInput.value = emailInput.value;
        loginBtn.style.backgroundColor = "rgba(83,186,190,0.5)";
        loginForm.style.display = "flex"; 

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

    let emailTitle = document.querySelector(".login .email");
    while ( emailTitle.childNodes.length > 2 ) {
        emailTitle.removeChild(emailTitle.lastChild)
    }

    let passwordTitle = document.querySelector(".login .password");
    while ( passwordTitle.childNodes.length > 2 ) {
        passwordTitle.removeChild(passwordTitle.lastChild)
    }
    
    // feedback error message when one of the inputs is empty
    for ( let input of [emailInput, passwordInput] ) {
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
        window.location.replace("/main");

    }
    catch(error) {
        console.log(error)
    }

});