from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import socketio
from flask import request, session
import RoadBuddy.event_handler



@socketio.on("position")
def position(data):
    sid = data.get("sid")
    new_coord = data.get("coord")
    team_id = data.get("team_id")

    # If not in team, update position to own map
    if team_id == None:
        if len(RoadBuddy.event_handler.own_coords) >= 2:
            del RoadBuddy.event_handler.own_coords[0]
            RoadBuddy.event_handler.own_coords.append(new_coord)
            data = {request.sid : RoadBuddy.event_handler.own_coords}
            emit("movingPostion", data, to=request.sid)

        if len(RoadBuddy.event_handler.own_coords) == 1 :
            RoadBuddy.event_handler.own_coords.append(new_coord)
            data = {request.sid : RoadBuddy.event_handler.own_coords}
            # emit("initPosition", data, to=request.sid)

        if len(RoadBuddy.event_handler.own_coords) == 0 :
            RoadBuddy.event_handler.own_coords.append(new_coord)
            data = {request.sid : RoadBuddy.event_handler.own_coords}
            # emit("initPosition", data, to=request.sid)
        return

    # If in a team, update all partners position
    user_coords = RoadBuddy.event_handler.rooms_info.get(team_id)["partner"].get(sid)

    if len(user_coords) >= 2:
        del RoadBuddy.event_handler.rooms_info[team_id]["partner"][sid][0]
        RoadBuddy.event_handler.rooms_info[team_id]["partner"][sid].append(new_coord)
        emit("movingPostion", RoadBuddy.event_handler.rooms_info[team_id]["partner"], to=team_id)

    if len(user_coords) == 1 :
        RoadBuddy.event_handler.rooms_info[team_id]["partner"][sid].append(new_coord)
        emit("initPosition", RoadBuddy.event_handler.rooms_info[team_id]["partner"], to=team_id)

    if len(user_coords) == 0 :
        RoadBuddy.event_handler.rooms_info[team_id]["partner"][sid].append(new_coord)
        # emit("initPosition", RoadBuddy.event_handler.rooms_info[team_id], to=team_id)
    

