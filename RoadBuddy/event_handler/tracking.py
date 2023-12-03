from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import socketio
from flask import request, session
from RoadBuddy.event_handler import rooms_info



@socketio.on("position")
def position(position):

    print(f'rooms_info in socket event (position) : {rooms_info}')
    user_socket_id = request.sid
    team_id = session.get("team_id")
    username = session.get("username")
    new_coord = position["coord"]
    user_coords = rooms_info[team_id][user_socket_id]["coords"]


    if len(user_coords) >= 2:
        del user_coords[0]
        user_coords.append(new_coord)
        print(rooms_info[team_id])
        emit("movingPostion", rooms_info[team_id], to=team_id)

    if len(user_coords) == 1 :
        user_coords.append(new_coord)
        print(rooms_info[team_id])
        emit("initPosition", rooms_info[team_id], to=team_id)

    if len(user_coords) == 0 :
        user_coords.append(new_coord)
        print(rooms_info[team_id])
        emit("initPosition", rooms_info[team_id], to=team_id)