export {
    marker, initialCoord, sidArray, sidReference, markerArray, 
    ownColor, partnersColor, map, team_sender_info_cache, friend_sender_info_cache
}

// ----- declare global variables -----
let//
marker,
initialCoord,
sidArray = [],
sidReference,
markerArray = [],
ownColor = `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`,
partnersColor = {},
map,
team_sender_info_cache,
friend_sender_info_cache;
