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