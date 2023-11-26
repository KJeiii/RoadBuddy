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
        let result = response.json();

        if (response.status !== 200) {
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
loginBtn.addEventListener("click", () => {
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

});