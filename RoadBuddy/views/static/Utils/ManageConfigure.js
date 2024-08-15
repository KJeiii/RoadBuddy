import { isInputFilledIn, isPasswordInputPass, isInputValuesConsistent, RenderErrorMessage, inputErrorMessages, isInputErrorRepeating, isInputValuesUnique } from "./GeneralControl.js";

export function PreviewAvatar(avatarFile, elementToPreviewAvatar){
    const fileReader = new FileReader();
    fileReader.onload = () =>{
        elementToPreviewAvatar.style.backgroundImage = `url(${fileReader.result})`;
        elementToPreviewAvatar.style.backgroundSize = "80%";
    };
    fileReader.readAsDataURL(avatarFile);
}

export function SwitchAvatarUndoBtn(undoBtnCssSelector){
    const//
        undoBtn = document.querySelector(undoBtnCssSelector), //"div.configure-outer div.image div.undo"
        isShown = (undoBtn.style.display === "block") ? true : false;
    undoBtn.style.display = (isShown) ? "none" : "block";
}

export function RenderUpdateResponse(responseCode){
    document.querySelector(".configure-pannel").style.display = "none";
    document.querySelector(".configure-response").style.display = "flex";
    const//
        responseTitle = document.querySelector(".configure-response p"),
        img = document.querySelector(".configure-response img");

    const resultObj = {
        0: {title: "更新失敗", img_src: "../static/images/error.gif"},
        1: {title: "更新完成", img_src: "../static/images/check.gif"},
        2: {title: "無資料需更新", img_src: "../static/images/error.gif"},
        3: {title: "更新中", img_src: "../static/images/loading.gif"}
    };
    responseTitle.textContent = resultObj[responseCode].title;
    img.src = resultObj[responseCode].img_src;
}

export function SwitchChangePasswordPrompt(){
    const//
        prompt = document.querySelector("div.update-password"),
        isShown = prompt.style.display === "flex";
    console.log(isShown);
    prompt.style.display = isShown ? "none" : "flex";
}

export function ClearInputValues(inputElementsArray){
    inputElementsArray.forEach(input => {input.value = "";});
}