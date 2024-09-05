from flask_socketio import SocketIO, emit, send, join_room, leave_room, rooms
from RoadBuddy import socketio
from flask import request
import RoadBuddy.event_handler
from RoadBuddy.models import friend

friendTool = friend.FriendTool()

# Listener for receiver event "connect" from client
@socketio.on("connect")
def connect():
    RoadBuddy.event_handler.online_users.append_user_sid(request.sid)

# Listener for receiver event "store_userinfo" from client
@socketio.on("store_userinfo")
def store_userinfo(user):
    RoadBuddy.event_handler.online_users.update_user_information(user["userID"], sid = user["userSID"])
    RoadBuddy.event_handler.online_users.update_user_sid_category(request.sid, user["userID"])


@socketio.on("sync_online_user")
def sync_online_user():        
    emit("sync_online_user", RoadBuddy.event_handler.online_users.get_all_users_id(), to=request.sid)


# Listener for receiver event "disconnect" from client
@socketio.on("disconnect")
def disconnect():
    user_sid = request.sid
    user_id = RoadBuddy.event_handler.online_users.get_user_id(user_sid)

    if RoadBuddy.event_handler.online_users.is_user_online(user_id):
        (username, email, team_id, sid, friend_list, *rest) = RoadBuddy.event_handler.online_users.get_user_information(user_id).values()

        # send event "update_friend_status" to friends 
        online_friend_sid_list = []
        for friend in friend_list:
            friend_id = int(friend["user_id"])
            if friend_id in RoadBuddy.event_handler.online_users.get_all_users_id():
                friend_sid = RoadBuddy.event_handler.online_users.get_user_sid(friend_id)
                online_friend_sid_list.append(friend_sid)

        for friend_sid in online_friend_sid_list:
            my_offline_information = {
                "update-type" : "offline", 
                "offline_friend_id": {
                    "user_id": user_id,
                    "user_sid": user_sid,
                    "username": username
                    }
            }
            emit("update_friend_status", my_offline_information, to = friend_sid)

        # send event "leave_team" to team partners for removing marker
        if RoadBuddy.event_handler.online_users.is_user_traveling(user_id):
            my_leaving_team_information = {
                "sid": user_sid,
                "user_id": user_id,
                "username": username,
                "email":  email,
                "team_id": team_id
            }
            emit("leave_team", my_leaving_team_information, to=team_id)
            leave_room(team_id)
            del RoadBuddy.event_handler.rooms_info[team_id]["partners"][user_sid]

            if len(RoadBuddy.event_handler.rooms_info[team_id]["partners"].keys()) <= 0 :
                del RoadBuddy.event_handler.rooms_info[team_id]

        # remove user online status
        RoadBuddy.event_handler.online_users.remove_user(user_sid)



