export function PreviewAvatar(avatarFile, elementToPreviewAvatar){
    const fileReader = new FileReader();
    fileReader.onload = () =>{
        elementToPreviewAvatar.style.backgroundImage = `url(${fileReader.result})`;
        elementToPreviewAvatar.style.backgroundSize = "100%";
    };
    fileReader.readAsDataURL(avatarFile);
}

export function SwitchAvatarUndoBtn(undoBtnCssSelector){
    const//
        undoBtn = document.querySelector(undoBtnCssSelector), //"div.configure-outer div.image div.undo"
        isShown = (undoBtn.style.display === "block") ? true : false;
    undoBtn.style.display = (isShown) ? "none" : "block";
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