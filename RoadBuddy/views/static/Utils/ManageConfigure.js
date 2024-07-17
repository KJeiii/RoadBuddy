
export function PreviewAvatar(){
    const//
        avatarImg = document.querySelector("input#avatar").files[0],
        imagePreview = document.querySelector(".configure-outer .image"),
        fileReader = new FileReader();
    
    fileReader.onload = () =>{
        imagePreview.style.backgroundImage = `url(${fileReader.result})`;
    }
    fileReader.readAsDataURL(avatarImg)
}

export function CollectUpdateBasicInfo(){
    const//
        dataToUpdate = new FormData(),
        avatarFile = document.querySelector("input#avatar").files[0],
        usernameToUpdate = document.querySelector("input#username-to-update").value;
    dataToUpdate.append("usernameToUpdate", usernameToUpdate);
    dataToUpdate.append("avatar", avatarFile);
    return dataToUpdate
}

export async function UpdateBasicInfo(formDataToUpdate){
    try{
        const response = await fetch("/api/member/update/basic", {
            method: "PATCH",
            body: formDataToUpdate
        });
        if (!response.ok){throw {ok: false, message: response.statusText}}
        const result = await response.json();
        return {ok: true, message: result}
    }
    catch(error){
        console.log("Failed to execute UpdateBasicInfo: ", error)
        throw {ok: false, message: error}
    }
}

export function RenderUpdateResult(isSuccess){
    const//
        responseTitle = document.querySelector(".configure-response p"),
        img = document.querySelector(".configure-response img");
    responseTitle.textContent = isSuccess ? "更新完成" : "更新失敗";
    img.src =  isSuccess ? "../static/images/check.gif" : "../static/images/error.gif";
}