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
var errorMsg = {
    signup : {
        empty: "姓名、電子信箱、密碼不可空白",
        username_exist: "姓名已被使用",
        email_exist: "電子信箱已被使用",
        password_not_match: "密碼兩次輸入不一致"
    },
    login : {
        email_incorrect : "此電子信箱尚未註冊",
        password_incorrect : "密碼不正確"
    }
};

signupBtn.addEventListener("click", () => {
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
        }
    }

    // check email format by identify "@"
    if ( emailInput.value.includes("@") != true ) {
        let//
        inputTitle = document.querySelector(".signup .email"),
        msg = document.createElement("div");
        msg.textContent = "(格式錯誤，須包含@)";
        msg.style.color = "red";
        msg.style.fontSize = "15px";
        msg.style.lineHeight = "30px";
        msg.style.marginLeft = "10px";
        inputTitle.appendChild(msg)
    }

    // check if username has used

});
