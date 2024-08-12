import { ClearErrorMessage, ControlMebmerMsgBox, RenderErrorMessage, SwitchBetweenSignupAndLogin, 
    SwitchSignUpStep, VerifyInputValue, isEmailInputPass, isInputFilledIn, isInputValueIncludingCharacters, 
    isInputValuesConsistent, isPasswordInputPass, isUsernameInputPass} from "./Utils/GeneralControl.js";
import { PreviewAvatar, SwitchAvatarUndoBtn } from "./Utils/ManageConfigure.js";
import { CheckUserStatus, CollectInformationToSignup, SignupNewAccount } from "./Utils/ManageUser.js";

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

// --- go to next step after passing examination of user information: avatar uploading
document.querySelector("button.next").addEventListener("click", ()=>{
    const isAllInputValuesEligible = true & 
        isEmailInputPass(document.querySelector("div.signup div.form-div input[name='email']")) &
        isUsernameInputPass(document.querySelector("div.signup div.form-div input[name='username']")) &
        isPasswordInputPass(
            document.querySelector("div.signup div.form-div input[name='password']"), 
            document.querySelector("div.signup div.form-div input[name='confirm-password']"));
    (isAllInputValuesEligible == true) && SwitchSignUpStep();
})

// --- go back to previous step
document.querySelector("button.previous").addEventListener("click", SwitchSignUpStep);

// --- check values of inputs when they are changed
const inputElements = document.querySelectorAll("div.signup div.form-div input");
inputElements.forEach((input)=>{
    const//
        isEmailInput = input.getAttribute("name") === "email",
        isUsernameInput = input.getAttribute("name") === "username",
        isPasswordInput = input.getAttribute("name") === "password",
        isConfirmPasswordInput = input.getAttribute("name") === "confirm-password";
    if (isEmailInput){
        input.addEventListener(
            "change", 
            function(){
                ClearErrorMessage(this.previousElementSibling);
                VerifyInputValue(this, isInputValueIncludingCharacters, "@")}
        )}
    if (isConfirmPasswordInput){
        input.addEventListener(
            "change",
            function(){
                ClearErrorMessage(this.previousElementSibling);
                VerifyInputValue(this, isInputValuesConsistent, document.querySelector("div.signup div.form-div input[name='password']"))
            }
        )}
    if (isUsernameInput || isPasswordInput){
        input.addEventListener("change", function(){ClearErrorMessage(this.previousElementSibling)})
        }
})

// --- signup ---
document.querySelector("button.signup").addEventListener("click", () => {
    const avatarInput = document.querySelector("div.signup div.form-div input#avatar");
    if(!isInputFilledIn(avatarInput)){
        ControlMebmerMsgBox("div.signup-prompt", "flex");
        return
    }
    SignupNewAccount(CollectInformationToSignup())
        .then((signupResponse) => {
            if (!signupResponse.ok){
                SwitchSignUpStep();
                RenderErrorMessage(document.querySelector("div.signup div.form-div-title.email"), signupResponse.message);
                return
            }
            SwitchBetweenSignupAndLogin();
            document.querySelector("div.login input[name=email]").value = signupResponse.email;
        })
        .catch((error)=>{console.log(error)})
});

// --- click no button of signup prompt ---
document.querySelector("div.signup-prompt button.no").addEventListener("click", ()=>{
    ControlMebmerMsgBox("div.signup-prompt", "none");
})

// --- click yes button of signup prompt ---
document.querySelector("div.signup-prompt button.yes").addEventListener("click", ()=>{
    SignupNewAccount(CollectInformationToSignup())
        .then((signupResponse) => {
            if (!signupResponse.ok){
                SwitchSignUpStep();
                RenderErrorMessage(document.querySelector("div.signup div.form-div-title.email"), signupResponse.message);
                return
            }
            ControlMebmerMsgBox("div.signup-prompt", "none");
            SwitchBetweenSignupAndLogin();
            document.querySelector("div.login input[name=email]").value = signupResponse.email;
        })
        .catch((error)=>{console.log(error)})
})

// --- login ---
document.querySelector("button.login").addEventListener("click", async() => {
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
                RenderErrorMsg(".login .email", result.message);
                return;
            }
            else{
                RenderErrorMsg(".login .password", result.message);
                return;
            }
        }
        
        let jwt = result.token;
        window.localStorage.setItem("token", jwt);
        window.location.replace("/main");
    }
    catch(error) {console.log(error)}
});