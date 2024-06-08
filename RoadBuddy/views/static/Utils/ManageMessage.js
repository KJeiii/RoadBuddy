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

export function RenderMessagePannel(){
    class DOMElement{
        constructor(elementType, className){
            this.elementType = elementType;
            this.className = className;
        };
        CreateDOMElement(){
            const element = document.createElement(this.elementType);
            element.setAttribute("class", this.className);
            return element
        }
    }
    
    const//
        messagePannel = new DOMElement("div", "message-pannel").CreateDOMElement(),
        closeBtn = new DOMElement("div", "close").CreateDOMElement(),
        pannelTitle = new DOMElement("div", "pannel-title").CreateDOMElement(),
        messageOuter = new DOMElement("div", "message-outer").CreateDOMElement(),
        messageList = new DOMElement("div", "message-list").CreateDOMElement();
    
    pannelTitle.textContent = "交友邀請";
    messageOuter.appendChild(messageList);
    for ( let item of [closeBtn, pannelTitle, messageOuter]){
        messagePannel.appendChild(item);
    }
    document.body.appendChild(messagePannel);
}