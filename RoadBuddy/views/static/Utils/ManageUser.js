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