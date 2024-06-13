import { SwitchPannel } from "./GeneralControl.js";

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

export function RenderMessageBtn(checkAlready){
    const//
    hasMessages = document.querySelectorAll(".message-list .item").length > 1,
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

export class MessageInfo{
    constructor(){}
    messageInfo = {/*messageID: {sender: number, senderName: string, receiverID: number}*/};
    UpdateInfo(message){  /*{message_id: number, sender_id: number, sender_name: string, receiver_id: number, receiver_name: string}*/
        this.messageInfo = {
            ...this.messageInfo, 
            [message.message_id]: {
                senderID: message.sender_id,
                senderName: message.sender_name,
                receiverID: message.receiver_id,
                receiverName: message.receiver_name
            }}
    };
    DeleteInfo(senderID){
        for (const messageID in this.messageInfo){
            if (this.messageInfo[messageID].senderID === senderID) {
                delete this.messageInfo[messageID];
                return
            }
        }
    };
    ShowInfo(){console.log(this.messageInfo)};
    FindSenderName(senderID){
        for (const messageID in this.messageInfo){
            if (this.messageInfo[messageID].senderID === senderID){
                return this.messageInfo[messageID].senderName
            }
            else{return null}
        }
    };
    FindReceiverName(receiverID){
        for (const messageID in this.messageInfo){
            if (this.messageInfo[messageID].receiverID === receiverID){
                return this.messageInfo[messageID].receiverName
            }
            else{return null}
        }
    };
}