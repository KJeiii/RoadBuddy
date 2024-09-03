import { map } from "./AppClass.js";
import { VerifyInputValue, isInputFilledIn } from "./GeneralControl.js";

export async function SignupNewAccount(dataToSingup){
    try{
        const//
            response = await fetch("/api/member", {method: "POST",body: dataToSingup}),
            result = await response.json();
        return {...result, status: response.status}
    }
    catch(error){
        console.log("Failed to execute SignupNewAccount (ManageUser.js): ", error);
        throw error
    }
}

// build function for checking user status
export async function CheckUserStatus() {
    let jwt = window.localStorage.getItem("token");
    try{
        // Return promise result if not logging yet
        if ( jwt === null) {return {"ok":false, "data": null}}

        // Verify user's token and return result
        let//
            response = await fetch("/api/member/auth", {
                method: "GET",
                headers: {"authorization": `Bearer ${jwt}`}
            }),
            result = await response.json();
        if (result.data === null) {return {"ok": false, "data": null}}
        return {"ok": true, "data": result}
    }
    catch(error) {
        console.log(`Error in CheckUserStatus : ${error}`)
        throw error
    }
}

// cache user_id, username, team_id, email, friendList in sessionStorage
export function ManipulateSessionStorage(setOrRemoveOrClear, ...rest){
    try {
        //store data
        if (setOrRemoveOrClear === "set") {
            for (let key in rest[0]){window.sessionStorage.setItem(key, rest[0][key])}
        }
        //remove specified data
        if (setOrRemoveOrClear === "remove"){
            rest.forEach((key)=>{window.sessionStorage.removeItem(key)})
        }
        //remove ALL data
        if (setOrRemoveOrClear === "clear"){window.sessionStorage.clear()}
    }
    catch(error){console.log(error)}
}

export function EmitStoreUserInfoEvent(userID, username, email, friendList){
    let userInfo = {
        user_id: userID,
        username: username,
        email: email,
        friend_list: friendList
    };
    socket.emit("store_userinfo", userInfo);
}

export function RenderUsername(username){
    document.querySelector(".main-pannel .description").textContent = `Here we go! ${username}`;
    document.querySelector(".configure-pannel input#username-to-update").value = username;
}

export function RenderEmail(email){
    document.querySelector(".configure-form-email div.value").textContent = email;
}

export function RenderAvatar(imageUrl){
    if (imageUrl !== null){
        document.querySelector(".user-info .icon").style.backgroundImage = `url(${imageUrl})`;
        document.querySelector(".configure-outer .image").style.backgroundImage = `url(${imageUrl})`;
    }
}

export function GetRandomIconColor(){
    return `rgb(
        ${Math.floor(Math.random()*256)},
        ${Math.floor(Math.random()*256)},
        ${Math.floor(Math.random()*256)}
        )`
}

export function DrawCanvas(username, userColor){
    const//
        canvas = document.querySelector("canvas.icon-canvas"),
        context = canvas.getContext("2d"),
        userFirstCharacter = username[0],
        characterPosition = (["W", "M"].includes(userFirstCharacter)) ? {x:10,y:175} : {x:40,y:175},
        userColorIsAccessible = userColor !== null;

    context.fillStyle = userColorIsAccessible ? userColor : "rgb(128,128,128)"; //"rgb(128,128,128)" is grey
    context.fillRect(0,0,200,200);
    context.font = "bold 180px serif";
    context.fillStyle = "rgb(0,0,0)";
    context.fillText(userFirstCharacter, characterPosition.x, characterPosition.y);
}

export function ClearCanvasContext(){
    const canvasContext = document.querySelector("canvas.icon-canvas").getContext("2d");
    canvasContext.clearRect(0,0,200,200);
}

export function CreateIconImage(username, userColor){
    DrawCanvas(username, userColor);
    const imageUrl = document.querySelector("canvas.icon-canvas").toDataURL();
    return imageUrl
}

export function ChangeIconColor(sid, username){
    ClearCanvasContext();
    const//
        newColor = GetRandomIconColor(),
        newImageUrl = CreateIconImage(username, newColor);   
    ManipulateSessionStorage("set", {iconColor: newColor, image_url: newImageUrl});
    RenderAvatar(newImageUrl);
    map.UpdateMarkerImage(sid, newImageUrl);
    ClearCanvasContext();
}

export function CollectInformationToSignup(){
    const dataToSingup = new FormData();
    dataToSingup.append("email", document.querySelector("div.signup div.form-div input[name='email']").value);
    dataToSingup.append("username", document.querySelector("div.signup div.form-div input[name='username']").value);
    dataToSingup.append("password", document.querySelector("div.signup div.form-div input[name='password']").value);
    dataToSingup.append("avatar", document.querySelector("div.signup div.form-div input[name='avatar']").files[0]);
    return dataToSingup
}

export async function CollectInformationToUpdate(){
    const//
        hasFile = document.querySelector("input#avatar").files.length > 0,
        hasNewUsername = document.querySelector("input#username-to-update").value 
                        !== window.sessionStorage.getItem("username");

    if (hasFile || hasNewUsername){
        const//
            avatarFile = document.querySelector("input#avatar").files[0],
            usernameToUpdate = document.querySelector("input#username-to-update").value,
            dataToUpdate = new FormData();
        dataToUpdate.append("usernameToUpdate", usernameToUpdate);
        dataToUpdate.append("avatar", avatarFile);
        return dataToUpdate
    }
    throw "There is no new information to update."
}

export async function UpdateUserInformation(formDataToUpdate){
    try{
        const response = await fetch("/api/member/update/basic", {
            method: "PATCH",
            headers: {"authorization": `Bearer ${window.localStorage.getItem("token")}`},
            body: formDataToUpdate
        });
        if (!response.ok){return {responseCode: 0, message: response.statusText}}
        const result = await response.json();
        return {...result, responseCode: 1}
    }
    catch(error){
        console.log("Failed to execute UpdateUserInformation: ", error)
        throw {responseCode: 0, ...error}
    }
}

export async function UpdatePassword(oldPassword, newPassword, JWT){
    try{
        const//
            response = await fetch('/api/member/update/pwd', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${JWT}`},
            body: JSON.stringify({oldPassword: oldPassword, newPassword: newPassword})
        }),
        resultOfUpdate = await response.json();
        if (resultOfUpdate.error){
            console.log(resultOfUpdate);
            return {...resultOfUpdate, responseCode: 4}
        }
        return {...resultOfUpdate, responseCode: 1}
    }
    catch(error){
        console.log("Failed to execute UpdatePassword (ManageUser.js): ", error)
        throw {...error, responseCode: 0}
    }
}

export async function VerifyPasswordInputs(){
    let isAllInputValuesEligible = true;
    const [oldPwdInput, newPwdInput, confirmPwdInput] = document.querySelectorAll("div.update-password input");
    [oldPwdInput, newPwdInput, confirmPwdInput].forEach(pwdInput => {
        isAllInputValuesEligible &= VerifyInputValue(pwdInput, isInputFilledIn).pass;
    });
    if (isAllInputValuesEligible){
        isAllInputValuesEligible &= VerifyInputValue(newPwdInput, isInputValuesUnique, oldPwdInput).pass;
        isAllInputValuesEligible &= VerifyInputValue(confirmPwdInput, isInputValuesConsistent, newPwdInput).pass;
    }
    if (!isAllInputValuesEligible){throw {pass: isAllInputValuesEligible}}
    return {
        pass: isAllInputValuesEligible,
        oldPassword: oldPwdInput.value,
        newPassword: newPwdInput.value
    }
}

export async function Login(email, password){
    try {
        const//
            loginResponse = await fetch("/api/member/auth", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email, password: password})
            }),
            result = await loginResponse.json();
        return {...result, status: loginResponse.status}
    }
    catch(error) {
        console.log(error);
        throw error
    }
}