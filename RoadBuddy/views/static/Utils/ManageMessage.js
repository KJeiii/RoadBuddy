
export async function CreateMessage(senderID, receiverIDArray){
    try{
        const response = await fetch(
            "/api/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderID: senderID,
                    receiverIDArray: receiverIDArray
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

export async function DeleteMessage(senderID, receiverID){
    try{
        const response = await fetch(
            "/api/message", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({sender_id: senderID, receiver_id: receiverID})
            });
        const result = await response.json();
        if(response.ok){return result.ok}
        throw new Error("Failed to execute DeleteMessage (ManageMessage.hs)")
    }
    catch(error){throw error}
}

export function RenderMessageBtn(checkAlready){
    const//
    hasMessages = document.querySelectorAll(".message-list .item")[0].children.length > 0,
    messageBtn = document.querySelector(".setting .message");
    if (checkAlready === false){
        if (hasMessages) {
            messageBtn.style.backgroundColor = "rgb(253,124,124)";
            messageBtn.style.display = "block";
        }
        else{
            messageBtn.style.backgroundColor = "";
            messageBtn.style.display = "none";
        }
        return 
    }
    messageBtn.style.backgroundColor = "";
    messageBtn.style.display = "none";
}