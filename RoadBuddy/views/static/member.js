import { SwitchBetweenSignupAndLogin, SwitchSignUpStep } from "./Utils/GeneralControl.js";
import { PreviewAvatar, SwitchAvatarUndoBtn } from "./Utils/ManageConfigure.js";
import { CheckUserStatus } from "./Utils/ManageUser.js";
CheckUserStatus()
    .then((result) => {
        if (result.ok) {
            window.location.replace("/main");
        }
    })
    .catch((error) => {console.log(`Error from CheckUserStatus in member page : ${error}`)})

    
// ----- switch sigup/login page -----
document.querySelector("div.title-signup").addEventListener("click", SwitchBetweenSignupAndLogin);
document.querySelector("div.title-login").addEventListener("click", SwitchBetweenSignupAndLogin);


// ----- submit user information when click signup/login button -----
let//
signupBtn = document.querySelector("button.signup"),
loginBtn = document.querySelector("button.login");

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

// --- preview avatar ---
const avatarInput = document.querySelector("div.form-div.avatar input[name='avatar']");
avatarInput.addEventListener("change", ()=>{
    PreviewAvatar(
        avatarInput.files[0], 
        document.querySelector("div.form-div.avatar label")
    );
    SwitchAvatarUndoBtn("div.form-div.avatar div.undo");
})

// --- undo avatar upload ---
document.querySelector("div.form-div.avatar div.undo").addEventListener("click", ()=>{
    const avatarLabel = document.querySelector("div.form-div.avatar label");
    avatarLabel.style.backgroundImage = "";
    avatarLabel.style.backgroundSize = "20%";
    document.querySelector("div.form-div.avatar input").value = "";
    SwitchAvatarUndoBtn("div.form-div.avatar div.undo");
})

// --- go to avatar uploading step after filling user information or singup
document.querySelector("button.next").addEventListener("click", SwitchSignUpStep);
document.querySelector("button.previous").addEventListener("click", SwitchSignUpStep);

// --- signup ---
signupBtn.addEventListener("click", async() => {
    let//
    emailInput = document.querySelector("div.signup input[name=email]"),
    usernameInput = document.querySelector("div.signup input[name=username]"),
    passwordInput = document.querySelector("div.signup input[name=password]"),
    confirmInput = document.querySelector("div.signup input[name=confirm-password]");
    
    let emailTitle = document.querySelector("div.signup div.form-div-title.email");
    while ( emailTitle.childNodes.length > 2 ) {
        emailTitle.removeChild(emailTitle.lastChild)
    }

    let passwordTitle = document.querySelector("div.signup div.form-div-title.confirm-password");
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
            headers: {"Content-Type": "application/json"},
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
        signupForm = document.querySelector("div.signup"),
        loginForm = document.querySelector("div.login"),
        loginBtn = document.querySelector("button.login"),
        loginMailInput = document.querySelector("div.login input[name=email]");
    
        signupForm.style.display = "none";
        loginMailInput.value = emailInput.value;
        loginBtn.style.backgroundColor = "rgba(83,186,190,0.5)";
        loginForm.style.display = "flex"; 
    }
    catch(error) {console.log(error)}
});

// --- login ---
loginBtn.addEventListener("click", async() => {
    let//
    emailInput = document.querySelector("div.login input[name=email]"),
    passwordInput = document.querySelector("div.login input[name=password]");

    let emailTitle = document.querySelector("div.login div.form-div-title.email");
    while ( emailTitle.childNodes.length > 2 ) {
        emailTitle.removeChild(emailTitle.lastChild)
    }

    let passwordTitle = document.querySelector("div.login div.form-div-title.password");
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
            headers: {"Content-Type": "application/json"},
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
    catch(error) {console.log(error)}
});