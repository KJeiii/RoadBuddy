from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import socketio
from flask import request, session
from RoadBuddy.event_handler import rooms_info



@socketio.on("position")
def position(data):

    print(f'rooms_info in socket event (position) : {rooms_info}')
    sid = data["sid"]
    team_id = data["team_id"]
    username = data["username"]
    new_coord = data["coord"]
    user_coords = rooms_info[team_id][sid]


    if len(user_coords) >= 2:
        del user_coords[0]
        user_coords.append(new_coord)
        emit("movingPostion", rooms_info[team_id], to=team_id)

    if len(user_coords) == 1 :
        user_coords.append(new_coord)
        emit("initPosition", rooms_info[team_id], to=team_id)

    if len(user_coords) == 0 :
        user_coords.append(new_coord)
        emit("initPosition", rooms_info[team_id], to=team_id)

    print(rooms_info[team_id])
