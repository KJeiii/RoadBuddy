export async function StoreMessage(userID, fromUserID){
    try{
        const response = await fetch(
            "/api/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: userID,
                    from_user_id: fromUserID
                })});
        const result = await response.json();
        if (response.ok){return result.ok};
        throw new Error("Failed to execute StoreMessge (ManageMessage.js)")
    }
    catch(error){throw error}
}

export async function SearchMessage(userID){
    try{
        const response = await fetch(
            "/api/message", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({user_id: userID})
            });
        const result = await response.json();
        if(response.ok){return result.data}
        throw new Error("Failed to execute SearchMessage (ManageMessage.hs)")
    }
    catch(error){throw error}
}

export async function DeleteMessage(userID){
    try{
        const response = await fetch(
            "/api/message", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({user_id: userID})
            });
        const result = await response.json();
        if(response.ok){return result.ok}
        throw new Error("Failed to execute DeleteMessage (ManageMessage.hs)")
    }
    catch(error){throw error}
}