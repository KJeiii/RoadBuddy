export function UserCoordError(error) {console.log(`Error in drawing initial map: ${error}`)};

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
            const myIcon = L.icon({
            iconUrl: imageUrl,
            iconSize: [40, 40],
            className: "icon-on-map"
            });
            const newMarker = L.marker([coordination.latitude, coordination.longitude], 
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

    GetAllMarkersSID(){
        try{return Object.keys(this.sidAndmarkerPair)}
        catch(error){console.log("Failed to execute method GetAllMarkersSID: ", error)}
    }
}