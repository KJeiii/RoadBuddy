from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import socketio
from flask import request, session
import RoadBuddy.event_handler

@socketio.on("position")
def position(data):
    sid = data.get("sid")
    new_coordination = data.get("coordination")
    team_id = data.get("team_id")
    is_user_in_team = RoadBuddy.event_handler.rooms_info[team_id]["partners"].get(sid) != None

    if is_user_in_team:
        RoadBuddy.event_handler.rooms_info[team_id]["partners"][sid]["coordination"] = new_coordination
        emit("movingPostion", RoadBuddy.event_handler.rooms_info[team_id]["partners"], to=team_id)
    

