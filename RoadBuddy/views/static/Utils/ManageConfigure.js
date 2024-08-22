export function PreviewAvatar(avatarFile, elementToPreviewAvatar){
    const fileReader = new FileReader();
    fileReader.onload = () =>{
        elementToPreviewAvatar.style.backgroundImage = `url(${fileReader.result})`;
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
        2: {title: "更新中", img_src: "../static/images/loading.gif"},
        3: {title: "無資料需更新", img_src: "../static/images/error.gif"},
        4: {title: "舊密碼不正確", img_src: "../static/images/error.gif"}
    };
    responseTitle.textContent = resultObj[responseCode].title;
    img.src = resultObj[responseCode].img_src;
}

export function SwitchChangePasswordPrompt(){
    const//
        prompt = document.querySelector("div.update-password"),
        isShown = prompt.style.display === "flex";
    prompt.style.display = isShown ? "none" : "flex";
}

export function ClearInputValues(...inputElements){
    inputElements.forEach(input => {input.value = "";});
}