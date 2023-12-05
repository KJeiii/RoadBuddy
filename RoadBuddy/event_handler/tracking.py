from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import socketio
from flask import request, session
from RoadBuddy.event_handler import rooms_info, own_coords



@socketio.on("position")
def position(data):
    sid = data.get("sid")
    username = data.get("username")
    new_coord = data.get("coord")
    team_id = data.get("team_id")

    # update position to own map before team up
    if team_id == None:
        # print(f'new coord from {sid} : {new_coord}')
        if len(own_coords) >= 2:
            del own_coords[0]
            own_coords.append(new_coord)
            data = {request.sid : own_coords}
            emit("movingPostion", data, to=request.sid)

        if len(own_coords) == 1 :
            own_coords.append(new_coord)
            data = {request.sid : own_coords}
            emit("initPosition", data, to=request.sid)

        if len(own_coords) == 0 :
            own_coords.append(new_coord)
            data = {request.sid : own_coords}
            emit("initPosition", data, to=request.sid)
        return

    # update all partners position
    user_coords = rooms_info.get(team_id).get(sid)
    print(f'new coord from {sid} : {new_coord}')
    if len(user_coords) >= 2:
        del rooms_info[team_id][sid][0]
        rooms_info[team_id][sid].append(new_coord)
        emit("movingPostion", rooms_info[team_id], to=team_id)

    if len(user_coords) == 1 :
        rooms_info[team_id][sid].append(new_coord)
        emit("initPosition", rooms_info[team_id], to=team_id)

    if len(user_coords) == 0 :
        rooms_info[team_id][sid].append(new_coord)
        emit("initPosition", rooms_info[team_id], to=team_id)
    
    print(rooms_info.get(team_id))

