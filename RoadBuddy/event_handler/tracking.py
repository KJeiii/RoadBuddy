from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import socketio
from flask import request, session
import RoadBuddy.event_handler

@socketio.on("position")
def position(new_movement):
    sid = new_movement.get("sid")
    new_coordination = new_movement.get("coordination")
    team_id = new_movement.get("team_id")
    is_user_in_team = sid in RoadBuddy.event_handler.rooms_info[team_id]["partners"].keys()

    if is_user_in_team:
        RoadBuddy.event_handler.rooms_info[team_id]["partners"][sid]["coordination"] = new_coordination
        emit("movingPostion", RoadBuddy.event_handler.rooms_info[team_id]["partners"], to=team_id)
    

