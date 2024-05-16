// build function for checking user status
export async function CheckUserStatus() {
    let jwt = window.localStorage.getItem("token");

    try{
        if ( jwt === null) {return {"ok":false, "data": null}}

        let//
        response = await fetch("/api/member/auth", {
            method: "GET",
            headers: {"authorization": `Bearer ${jwt}`}
        }),
        result = await response.json();

        if (result.data === null) {return {"ok": false, "data": null}}

        let data = {
            user_id: result.user_id,
            username: result.username,
            email: result.email
        }
    
        return {"ok": true, "data": data}
    }
    catch(error) {
        console.log(`Error in CheckUserStatus : ${error}`)
        throw error
    }
}


// cache user_id, username, team_id, email, friendList in sessionStorage
export function ManipulateSessionStorage(storeOrRemoveOrClear, ...rest){
    try {
        if (storeOrRemoveOrClear === "store") {
            for (let key in rest[0]){
                window.sessionStorage.setItem(key, rest[0][key])
            }
        }
    
        if (storeOrRemoveOrClear === "remove"){
            for (let key of rest){
                window.sessionStorage.removeItem(key)
            }
        }

        if (storeOrRemoveOrClear === "clear"){
            window.sessionStorage.clear()
        }
    }
    catch(error){console.log(error)}
}