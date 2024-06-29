from flask_socketio import SocketIO, emit, send, join_room, leave_room, rooms
from RoadBuddy import socketio
from flask import request
import RoadBuddy.event_handler
from RoadBuddy.models import friend

friendTool = friend.FriendTool()

# Listener for receiver event "connect" from client
@socketio.on("connect")
def connect():
    RoadBuddy.event_handler.my_sid = request.sid

# Listener for receiver event "store_userinfo" from client
@socketio.on("store_userinfo")
def store_userinfo(data):
    user_id = int(data["user_id"])
    RoadBuddy.event_handler.sid_reference[request.sid] = user_id
    RoadBuddy.event_handler.user_info[user_id] = {
        "username": data["username"],
        "sid": request.sid,
        "email": data["email"],
        "friend_list": data["friend_list"]
    }

    # initialize friend list at first time login
    emit("initialization", to=request.sid)


@socketio.on("sync_online_user")
def sync_online_user():        
    emit("sync_online_user", list(RoadBuddy.event_handler.user_info.keys()), to=request.sid)


# Listener for receiver event "disconnect" from client
@socketio.on("disconnect")
def disconnect():

    # send event "disconnect" to team partners for removing marker
    # 這邊應該要改成建立專屬的team event handler
    user_sid = request.sid
    user_id = RoadBuddy.event_handler.sid_reference.get(user_sid)

    if user_id != None:
        username = RoadBuddy.event_handler.user_info.get(user_id).get("username")
        email = RoadBuddy.event_handler.user_info.get(user_id).get("email")
        team_id = RoadBuddy.event_handler.user_info.get(user_id).get("team_id")

        data = {
            "sid": user_sid,
            "user_id": user_id,
            "username": username,
            "email":  email,
            "team_id": team_id
        }
        emit("disconnect", data, to=team_id)

        # send event "update_friend_status" to friends 
        friend_list = RoadBuddy.event_handler.user_info[user_id]["friend_list"]
        friend_sid_online = []
        for friend in friend_list:
            friend_id = int(friend["user_id"])
            if friend_id in RoadBuddy.event_handler.user_info.keys():
                friend_sid = RoadBuddy.event_handler.user_info[friend_id]["sid"]
                friend_sid_online.append(friend_sid)

        for sid in friend_sid_online:
            emit("update_friend_status", 
                {"update-type" : "offline", 
                "offline_friend_id": {
                    "user_id": user_id,
                    "user_sid": user_sid,
                    "username": username
                    }
                }
                , to=sid)


        # remove leaving partner
        if team_id != None:
            leave_room(team_id)
            del RoadBuddy.event_handler.rooms_info[team_id]["partner"][user_sid]

            if len(RoadBuddy.event_handler.rooms_info[team_id]["partner"].keys()) <= 0 :
                del RoadBuddy.event_handler.rooms_info[team_id]

        # remove user online status
        del RoadBuddy.event_handler.user_info[user_id]
        del RoadBuddy.event_handler.sid_reference[user_sid]


