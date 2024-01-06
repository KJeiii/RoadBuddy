from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import socketio
from flask import request, session
from RoadBuddy.event_handler import rooms_info, own_coords, user_info, sid_reference



@socketio.on("position")
def position(data):
    sid = data.get("sid")
    new_coord = data.get("coord")
    team_id = data.get("team_id")

    # If not in team, update position to own map
    if team_id == None:
        if len(own_coords) >= 2:
            del own_coords[0]
            own_coords.append(new_coord)
            data = {request.sid : own_coords}
            emit("movingPostion", data, to=request.sid)

        if len(own_coords) == 1 :
            own_coords.append(new_coord)
            data = {request.sid : own_coords}
            # emit("initPosition", data, to=request.sid)

        if len(own_coords) == 0 :
            own_coords.append(new_coord)
            data = {request.sid : own_coords}
            # emit("initPosition", data, to=request.sid)
        return

    # If in a team, update all partners position
    user_coords = rooms_info.get(team_id)["partner"].get(sid)

    if len(user_coords) >= 2:
        del rooms_info[team_id]["partner"][sid][0]
        rooms_info[team_id]["partner"][sid].append(new_coord)
        emit("movingPostion", rooms_info[team_id]["partner"], to=team_id)

    if len(user_coords) == 1 :
        rooms_info[team_id]["partner"][sid].append(new_coord)
        emit("initPosition", rooms_info[team_id]["partner"], to=team_id)

    if len(user_coords) == 0 :
        rooms_info[team_id]["partner"][sid].append(new_coord)
        # emit("initPosition", rooms_info[team_id], to=team_id)
    

