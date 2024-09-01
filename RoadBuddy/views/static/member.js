import { ClearErrorMessage, ControlMebmerMsgBox, RenderErrorMessage, RenderResponse, SwitchBetweenSignupAndLogin, 
    SwitchSignUpStep, VerifyInputValue, isEmailInputPass, isInputFilledIn, isInputValueIncludingCharacters, 
    isInputValuesConsistent, isPasswordInputPass, isUsernameInputPass} from "./Utils/GeneralControl.js";
import { PreviewAvatar, SwitchAvatarUndoBtn } from "./Utils/ManageConfigure.js";
import { CheckUserStatus, CollectInformationToSignup, Login, SignupNewAccount } from "./Utils/ManageUser.js";

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
    RenderResponse(".member-response", 1);
    SignupNewAccount(CollectInformationToSignup())
        .then((signupResponse) => {
            if (!signupResponse.ok){
                SwitchSignUpStep();
                RenderErrorMessage(document.querySelector("div.signup div.form-div-title.email"), signupResponse.message);
                RenderResponse(".member-response", 0, true);    
                return
            };
            RenderResponse(".member-response", 2);
            SwitchBetweenSignupAndLogin();
            RenderResponse(".member-response", 0, true);
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
    ControlMebmerMsgBox("div.signup-prompt", "none");
    RenderResponse(".member-response", 1);
    SignupNewAccount(CollectInformationToSignup())
        .then((signupResponse) => {
            if (!signupResponse.ok){
                SwitchSignUpStep();
                RenderResponse(".member-response", 0, true);
                RenderErrorMessage(document.querySelector("div.signup div.form-div-title.email"), signupResponse.message);
                return
            }
            RenderResponse(".member-response", 2);
            SwitchBetweenSignupAndLogin();
            RenderResponse(".member-response", 0, true);
            document.querySelector("div.login input[name=email]").value = signupResponse.email;
        })
        .catch((error)=>{console.log(error)})
})

// --- login ---
document.querySelector("button.login").addEventListener("click", async() => {
    RenderResponse(".member-response", 3);
    ClearErrorMessage(
        document.querySelector("div.login div.form-div-title.email"),
        document.querySelector("div.login div.form-div-title.password")
    );

    // feedback error message when one of the inputs is empty
    for (const input of document.querySelectorAll("div.login input")) {
        if  (input.value === "") {
            input.setAttribute("placeholder", "此欄位不可空白");
            input.style.border = "2px solid rgb(255, 197, 197)";
            return;
        }
    }

    // check email and password to log in
    Login(
        document.querySelector("div.login input[name=email]").value, 
        document.querySelector("div.login input[name=password]").value)
    .then(loginResult => {
        RenderResponse(".member-response", 0, true);
        // verification failed
        if (loginResult.error){
            const titleDivToAddErrorMsg = loginResult.message.includes("電子信件") ? 
                document.querySelector(".login .email") : document.querySelector(".login .password");
            RenderErrorMessage(titleDivToAddErrorMsg, loginResult.message);
            return
        }
        // verification passed
        window.localStorage.setItem("token", loginResult.token);
        window.location.replace("/main");
    })
    .catch(error => {console.log(error)})
});