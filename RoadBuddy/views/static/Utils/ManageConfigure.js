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

export async function CollectUpdateBasicInfo(){
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

export async function UpdateBasicInfo(formDataToUpdate){
    try{
        const response = await fetch("/api/member/update/basic", {
            method: "PATCH",
            headers: {"authorization": `Bearer ${window.localStorage.getItem("token")}`},
            body: formDataToUpdate
        });
        if (!response.ok){throw {responseCode: 0, message: response.statusText}}
        const result = await response.json();
        return {...result, responseCode: 1}
    }
    catch(error){
        console.log("Failed to execute UpdateBasicInfo: ", error)
        throw {responseCode: 0, message: error}
    }
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
