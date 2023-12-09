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
    print(f'before store {sid_reference}') 
    user_id = int(data["user_id"])
    sid_reference[request.sid] = user_id
    user_info[user_id] = {
        "username": data["username"],
        "sid": request.sid,
        "email": data["email"],
        "friend_list": data["friend_list"]
    }

    # send "online-status" event to friends on-line
    friend_list = data["friend_list"]
    friend_id_list = []
    friend_id_online = []
    for friend in friend_list:
        friend_id = int(friend["user_id"])
        friend_id_list.append(friend_id)
        if friend_id in user_info.keys():
            friend_id_online.append(friend_id)

    my_user_info = {
        "initializing": False,
        "user_id": user_id,
        "username": data["username"],
        "sid": request.sid,
        "email": data["email"]
    }

    for id in friend_id_online:
        friend_sid = user_info[id]["sid"]
        print(f'{data["username"]} sends online event to {user_info[id]["username"]}')
        emit("online_status", my_user_info, to=friend_sid)

    # send online friends data for user own when first time login
    initial_my_online_friend_id = []
    for sid in sid_reference:
        if sid_reference[sid] in friend_id_list:
            initial_my_online_friend_id.append(sid_reference[sid])

    initializing_info = {}
    for friend in friend_list:
        friend_id = int(friend["user_id"])
        if friend_id in initial_my_online_friend_id:
            initializing_info[friend_id] = friend["username"]
    print(initializing_info)

    emit("initial_status", initializing_info, to=request.sid)
    print(f'after store {sid_reference}') 




# Listener for receiver event "disconnect" from client
@socketio.on("disconnect")
def disconnect():

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

    # send event "offline_status" to update friend list in main page and team page
    friend_list = user_info[user_id]["friend_list"]
    friend_id_list = []
    for friend in friend_list:
        friend_id = int(friend["user_id"])
        friend_id_list.append(friend_id)

    for sid in sid_reference:
        online_user_id = sid_reference[sid]
        if online_user_id in friend_id_list:
            emit("offline_status", data, to=sid)

    if team_id != None:
        leave_room(team_id)
        del rooms_info[team_id][user_sid]

        if len(rooms_info[team_id].keys()) <= 0 :
            del rooms_info[team_id]
            print(f'team {team_id} is closed bu disconnect \
                cuz less than 1 pepele in it')

    del user_info[user_id]
    del sid_reference[user_sid]


# Listener for receiver event "disconnect" from client
@socketio.on("check_status")
def check_status(data):
    pass