from flask_socketio import SocketIO, emit, send, join_room, leave_room, rooms
from RoadBuddy import socketio
from flask import request
from RoadBuddy.event_handler import rooms_info, sid_reference, user_info
from RoadBuddy.models import friend

friendTool = friend.FriendTool()

# Listener for receiver event "connect" from client
@socketio.on("connect")
def connect():
    pass

# Listener for receiver event "store_userinfo" from client
@socketio.on("store_userinfo")
def store_userinfo(data):
    user_id = int(data["user_id"])
    sid_reference[request.sid] = user_id
    user_info[user_id] = {
        "username": data["username"],
        "sid": request.sid,
        "email": data["email"],
        "friend_list": data["friend_list"]
    }

    # initialize friend list at first time login
    emit("initialization", to=request.sid)




# Listener for receiver event "disconnect" from client
@socketio.on("disconnect")
def disconnect():

    # send event "disconnect" to team partners for removing marker
    # 這邊應該要改成建立專屬的team event handler
    user_sid = request.sid
    user_id = sid_reference.get(user_sid)
    username = user_info.get(user_id).get("username")
    email = user_info.get(user_id).get("email")
    team_id = user_info.get(user_id).get("team_id")

    data = {
        "sid": user_sid,
        "user_id": user_id,
        "username": username,
        "email":  email,
        "team_id": team_id
    }
    emit("disconnect", data, to=team_id)

    # send event "offline_friend_status" to friends 
    friend_list = user_info[user_id]["friend_list"]
    friend_sid_online = []
    for friend in friend_list:
        friend_id = int(friend["user_id"])
        if friend_id in user_info.keys():
            friend_sid = user_info[friend_id]["sid"]
            friend_sid_online.append(friend_sid)

    my_user_info = {
        "user_id": user_id,
        "username": user_info[user_id]["username"],
        "sid": request.sid,
        "email": user_info[user_id]["email"]
    }

    for sid in friend_sid_online:
        emit("offline_friend_status", my_user_info, to=sid)


    if team_id != None:
        leave_room(team_id)
        del rooms_info[team_id]["partner"][user_sid]

        if len(rooms_info[team_id]["partner"].keys()) <= 0 :
            del rooms_info[team_id]

    del user_info[user_id]
    del sid_reference[user_sid]


