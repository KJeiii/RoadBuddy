from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import socketio
from flask import request, session
from RoadBuddy.controllers.tracking import rooms_info


user_info = {}
sid_reference ={}

@socketio.on("connect")
def connect():
    # username = session.get("username")
    # team_id = session.get("team_id")

    # print(f'username and team_id in socket event (connect) : {username} / {team_id}')

    # if not username or not team_id:
    #     return
    
    # if team_id not in rooms_info.keys():
    #     leave_room(team_id)
    #     return

    # try: 
    #     # add new member to particular room
    #     rooms_info[team_id][request.sid] = {
    #         "username": username,
    #         "coords": []
    #     }

    #     print(f'rooms_info after create/join : {rooms_info}')

    #     join_room(team_id)
    #     emit("message", f'new partner joins : {username}\n', to=team_id)


    # except Exception as error:
    #     print(f'error in socketio event(connect): {error}')
    pass



@socketio.on("store_userinfo")
def store_userinfo(data):

    sid_reference[request.sid] = int(data["user_id"])
    user_info[int(data["user_id"])] = {
        "username": data["username"],
        "sid": request.sid,
        "email": data["email"]
    }

    print(f'sid_reference after socket event(store_userinfo) : {sid_reference}')
    print(f'user_info after socket event(store_userinfo) : {user_info}')



@socketio.on("disconnect")
def disconnect():

    del user_info[sid_reference[request.sid]]
    del sid_reference[request.sid]

    print(f'sid_reference after socket event(disconnect) : {sid_reference}')
    print(f'user_info after socket event(disconnect) : {user_info}')

    user_socket_id = request.sid
    username = session.get("username")
    team_id = session.get("team_id")

    
    leave_room(team_id)
    del rooms_info[team_id][user_socket_id]

    if len(rooms_info[team_id].keys()) == 0 :
        del rooms_info[team_id]

    emit("disconnect", user_socket_id, to=team_id)
    emit("message", f'partner leaves : {username}\n', to=team_id)