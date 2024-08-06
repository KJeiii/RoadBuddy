import { map } from "./AppClass.js";

// build function for checking user status
export async function CheckUserStatus() {
    let jwt = window.localStorage.getItem("token");
    try{
        // Return promise result if not logging yet
        if ( jwt === null) {return {"ok":false, "data": null}}

        // Verify user's token
        let//
            response = await fetch("/api/member/auth", {
                method: "GET",
                headers: {"authorization": `Bearer ${jwt}`}
            }),
            result = await response.json();

        // If verification does not pass
        if (result.data === null) {return {"ok": false, "data": null}}
        
        // If verification passes
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
            for (let key in rest[0]){
                window.sessionStorage.setItem(key, rest[0][key])
            }
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