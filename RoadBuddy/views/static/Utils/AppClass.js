export class OnlineFriends{
    constructor(){};
    friends = {/*id: {sid: string, name: string}*/};
    UpdateInfo(id, sid, name){
        this.friends = {...this.friends, [id]: {sid: sid, name: name}};
    };
    DeleteInfo(id){delete this.friends[id]}
    ShowInfo(){console.log(this.friends)};
    FindFriendSID(id){return this.friends[id].sid};
    FindFriendName(id){return this.friends[id].name};
    GetAllFriendIDArray(){return Object.keys(this.friends).map((id) => id*1)}
}

export class Map{
    constructor(){}
    sidAndmarkerPair = {}; // {sid: markerobject}
    map = null;

    CreateMap(coordination){
        try{
            this.map = L.map('map').setView([coordination.latitude, coordination.longitude], 15);
            const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(this.map);
            // let markerOption = {
            //     color: ownColor,
            //     fillOpacity: 0.7
            // };
            // marker = L.marker([initialCoord.latitude, initialCoord.longitude], {icon: myIcon}).addTo(map);
            // 如果是要用其他marker，{icon:myIcon}這組變數要改
        }
        catch(error){console.log("Failed to execute method CreateMap in Map class: ", error)}
    }

    CreateMarker(sid, imageUrl, coordination){ //coordination = {latitude: XXX, longitude: XXX}
        try{
            const//
                myIcon = L.icon({iconUrl: imageUrl, iconSize: [40, 40], className: `sid${sid}`}),
                newMarker = L.marker(
                    [coordination.latitude, coordination.longitude], 
                    {icon: myIcon}).addTo(this.map);
            this.sidAndmarkerPair[sid] = newMarker;
        }
        catch(error){console.log("Failed to execute method CreateMarker in Map class: ", error)}
    }

    RemoveMarker(sid){
        try{
            this.map.removeLayer(this.sidAndmarkerPair[sid]);
            delete this.sidAndmarkerPair[sid];
        }
        catch(error){"Failed to execute method RemoveMarker in Map class: ", error}
    }

    RemoveAllOtherMarkersExcept(sidToSave){
        try{
            for(const sid in this.sidAndmarkerPair){
                const isSidToRemove = sid !== sidToSave;
                if (isSidToRemove){
                    this.map.removeLayer(this.sidAndmarkerPair[sid]);
                    delete this.sidAndmarkerPair[sid];
                }}
        }
        catch(error){console.log("Failed to execute method RemoveAllOtherMarkersExcept in Map class: ",error)}
    }

    UpdateMarkerPosition(sid, newCoordination){ //coordination = {latitude:xxx, longitude:xxx}
        try{this.sidAndmarkerPair[sid].setLatLng([newCoordination.latitude, newCoordination.longitude])}
        catch(error){console.log("Failed to execute method UpdateMarkerPosition in Map class: ", error)}
    }

    UpdateMarkerImage(sid, imageUrl){
        try{
            const marker = document.querySelector(`.leaflet-marker-pane img.sid${sid}`);
            marker.src = imageUrl;
        }
        catch(error){console.log("Failed to execute method UpdateMarkerImage in Map class: ", error)}
    }

    GetAllMarkersSID(){
        try{return Object.keys(this.sidAndmarkerPair)}
        catch(error){console.log("Failed to execute method GetAllMarkersSID: ", error)}
    }
}

export class Messages{
    constructor(){}
    messages = {/*messageID: {sender: number, senderName: string, receiverID: number}*/};
    UpdateInfo(message){  /*{message_id: number, sender_id: number, sender_name: string, receiver_id: number, receiver_name: string}*/
        this.messages = {
            ...this.messages, 
            [message.message_id]: {
                senderID: message.sender_id,
                senderName: message.sender_name,
                receiverID: message.receiver_id,
                receiverName: message.receiver_name
            }}
    };
    DeleteInfo(senderID){
        for (const messageID in this.messages){
            if (this.messages[messageID].senderID === senderID) {
                delete this.messages[messageID];
                return
            }
        }
    };
    ShowInfo(){console.log(this.messages)};
    FindSenderName(senderID){
        for (const messageID in this.messages){
            if (this.messages[messageID].senderID === senderID){
                return this.messages[messageID].senderName
            }
            else{return null}
        }
    };
    FindReceiverName(receiverID){
        for (const messageID in this.messages){
            if (this.messages[messageID].receiverID === receiverID){
                return this.messages[messageID].receiverName
            }
            else{return null}
        }
    };
    GetSenderList(){
        const senderList = [];
        for ( let messageID in this.messages) {
            const sentFromMe = this.messages[messageID].senderID === Number(window.sessionStorage.getItem("user_id"));
            if (sentFromMe){continue}
            senderList.push({
                senderID: this.messages[messageID].senderID,
                senderName: this.messages[messageID].senderName})
            }
        return senderList
    };
    isSentAlready(senderID, receiverID){
        let isSentAlready = false;
        for ( const messageID in this.messages){
            const//
                senderIDExists = this.messages[messageID].senderID === senderID,
                receiverIDExists = this.messages[messageID].receiverID === receiverID;
            if (senderIDExists && receiverIDExists) {isSentAlready = true}
        }
        return isSentAlready
    };
    ExtractNotYetRequestedUsers(userIDArray){
        return userIDArray.filter((userID) => {
            const isSentAlready = this.isSentAlready(Number(window.sessionStorage.getItem("user_id")), userID);
            if (!isSentAlready){return userID}
        })
    }
}

export class OnlineUsers{
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

// initialize objects
export const//
    onlineFriends = new OnlineFriends(),
    messages = new Messages(),
    onlineUsers = new OnlineUsers(),
    map = new Map();

