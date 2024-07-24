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

export class OnlineUserInfo{
    constructor(){}
    onlineUserIDs = [];
    AppendUserID(...rest){
        const onlineUserIDArray = rest[0];
        onlineUserIDArray.forEach((userID) => {
            !this.onlineUserIDs.includes(userID) && this.onlineUserIDs.push(userID)
        })
    }
    EmitSyncOnlineUserEvent(){
        socket.emit("sync_online_user")
    }
    GetOnlineUserIDArray(){
        return this.onlineUserIDs
    }
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

