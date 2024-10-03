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
    userIDAndMarkerPair = {}; // {id: markerobject}
    map = null;
    setIntervalID = null;
    watchPostionID = null;

    CreateMap(coordination){
        try{
            this.map = L.map('map').setView([coordination.latitude, coordination.longitude], 15);
            const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(this.map);
        }
        catch(error){console.log("Failed to execute method CreateMap in Map class: ", error)}
    }

    CreateMarker(userID, imageUrl, coordination){ //coordination = {latitude: XXX, longitude: XXX}
        try{
            const//
                myIcon = L.icon({iconUrl: imageUrl, iconSize: [40, 40], className: `id${userID}`}),
                newMarker = L.marker(
                    [coordination.latitude, coordination.longitude], 
                    {icon: myIcon}).addTo(this.map);
            this.userIDAndMarkerPair[userID] = newMarker;
        }
        catch(error){console.log("Failed to execute method CreateMarker in Map class: ", error)}
    }

    RemoveMarker(id){
        try{
            this.map.removeLayer(this.userIDAndMarkerPair[id]);
            delete this.userIDAndMarkerPair[id];
        }
        catch(error){"Failed to execute method RemoveMarker in Map class: ", error}
    }

    RemoveAllOtherMarkersExcept(userIDToSave){
        try{
            for(const userID in this.userIDAndMarkerPair){
                const toRemove = Number(userID) !== Number(userIDToSave);
                if (toRemove){
                    this.map.removeLayer(this.userIDAndMarkerPair[userID]);
                    delete this.userIDAndMarkerPair[userID];
                }}
        }
        catch(error){console.log("Failed to execute method RemoveAllOtherMarkersExcept in Map class: ",error)}
    }

    UpdateMarkerPosition(userID, newCoordination){ //coordination = {latitude:xxx, longitude:xxx}
        try{this.userIDAndMarkerPair[userID].setLatLng([newCoordination.latitude, newCoordination.longitude])}
        catch(error){console.log("Failed to execute method UpdateMarkerPosition in Map class: ", error)}
    }

    UpdateMarkerImage(imageUrl){
        try{
            const marker = document.querySelector(`.leaflet-marker-pane img`);
            marker.src = imageUrl;
        }
        catch(error){console.log("Failed to execute method UpdateMarkerImage in Map class: ", error)}
    }

    isMarkerCreated(userID){
        try{return this.userIDAndMarkerPair[userID] != undefined}
        catch(error){console.log("Failed to execute method isMarkerCreated: ", error)}
    }

    UpdatePosition(newCoordination){
        const//
            dataToUpdatePosition = { ...window.sessionStorage, coordination: {...newCoordination}},
            notInTeam = window.sessionStorage.getItem("team_id") === "" 
                    || window.sessionStorage.getItem("team_id") === null,
            userID = Number(window.sessionStorage.getItem("user_id"));
        delete dataToUpdatePosition["friendList"];
        if (notInTeam && this.isMarkerCreated(userID)){
            this.UpdateMarkerPosition(userID, newCoordination);
            return
        }
        socket.emit("position", dataToUpdatePosition);
    }

    ChangePositionRandomly(){
        if (this.watchPostionID !== null){
            navigator.geolocation.clearWatch(this.watchPostionID);
            this.watchPostionID = null;
        }
        if (this.setIntervalID === null){
            this.setIntervalID = setInterval(()=>{
                const//
                {initialLatitude, initialLongitude} = sessionStorage,
                randomCoords = {
                    latitude: Number(initialLatitude) + Math.random()*0.006, 
                    longitude: Number(initialLongitude) + Math.random()*0.006
                };
                this.UpdatePosition(randomCoords);
            }, 1000)
        }
    }

    TrackRealtimePostion(){
        if (this.setIntervalID !== null) {
            clearInterval(this.setIntervalID);
            this.setIntervalID = null;
        }
        if (this.watchPostionID === null){
            this.watchPostionID = navigator.geolocation.watchPosition((position)=>{
                const newCoordination = {latitude: position.coords.latitude, longitude: position.coords.longitude};
                this.UpdatePosition(newCoordination);
            })
        }
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

export class Teams {
    constructor(){}
    onlineTeamArray = []; 
    createdTeamArray = [];
    joinedTeamArray = [];

    UpdateOnlineTeam(onlineTeamIDArray){
        try{this.onlineTeamArray = onlineTeamIDArray}
        catch(error){console.log("Failed to execute method UpdateOnlineTeam in Teams class: ", error)}
    }

    isTeamOnline(teamID){
        try{return this.onlineTeamArray.includes(teamID)}
        catch(error){console.log("Failed to execute method isTeamOnline in Teams class: ", error)}
    }

    GetOnlineTeams(){
        try{return this.onlineTeamArray}
        catch(error){console.log("Failed to execute method GetOnlineTeams in Teams class: ", error)}
    }

    UpdateCreatedTeam(...createdTeamIDArray){
        try{
            createdTeamIDArray.forEach((teamID)=>{
                if (!this.createdTeamArray.includes(teamID)) {this.createdTeamArray.push(teamID)}
            })
        }
        catch(error){console.log("Failed to execute method UpdateCreatedTeam in Teams class: ", error)}
    }

    UpdateJoinedTeam(...joinedTeamIDArray){
        try{
            joinedTeamIDArray.forEach((teamID)=>{
                if (!this.joinedTeamArray.includes(teamID)) {this.joinedTeamArray.push(teamID)}
            })
        }
        catch(error){console.log("Failed to execute method UpdateJoinedTeam in Teams class: ", error)}
    }

    GetJoinedTeams(){
        try{return this.joinedTeamArray}
        catch(error){console.log("Failed to execute method GetJoinedTeam in Teams class: ", error)}
    }
}

// initialize objects
export const//
    onlineFriends = new OnlineFriends(),
    messages = new Messages(),
    onlineUsers = new OnlineUsers(),
    map = new Map(),
    teams = new Teams();

