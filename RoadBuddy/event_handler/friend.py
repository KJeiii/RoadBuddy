from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import socketio
from flask import request, session
from RoadBuddy.event_handler import sid_reference, user_info



@socketio.on("friend_reqeust")
def friend_request(data):
    print(data)

    sender_sid = data["sender_sid"]
    sender_id = sid_reference[sender_sid]

    for id in data["receiver_id"]:
        sender_data = {
            "sid": sender_sid,
            "user_id": sender_id,
            "username": user_info[sender_id]["username"],
            "email": user_info[sender_id]["email"]
        }
        emit("friend_request", sender_data, to=user_info[id]["sid"])
        print(f'{user_info[sender_id]["username"]} sends request to {user_info[id]["username"]}')


@socketio.on("friend_request_result")
def friend_request_result(data):
    print(data)

    # 回寄給sender
    sender_sid = data["sender_info"]["sid"]
    receiver_id = sid_reference[data["receiver_sid"]]
    receiver_info = user_info[receiver_id]
    data = {
        "accept": data["accept"],
        "sender_sid": sender_sid,
        "receiver_info": {
            "user_id": receiver_id,
            "username": receiver_info["username"],
            "email": receiver_info["email"]
        }
    }
    emit("friend_request_result", data, to=sender_sid)


@socketio.on("initial_friend_status")
def initial_friend_status():
    print(f'receive {user_info[sid_reference[request.sid]]["username"]} initial online status')
    # get online friends data for user first time login
    user_id = sid_reference[request.sid]
    friend_list = user_info[user_id]["friend_list"]
    online_friend_info = {}
    
    for friend in friend_list:
        friend_id = int(friend["user_id"])
        if friend_id in user_info.keys():
            online_friend_info[friend_id] = friend["username"]

    emit("update_friend_status", online_friend_info, to=request.sid)


@socketio.on("online_friend_status")
def online_friend_status():
    print(f'receive {user_info[sid_reference[request.sid]]["username"]} update online status')
    # send "online-status" event to friends on-line
    user_id = sid_reference[request.sid]
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
        emit("update_friend_status", my_user_info, to=sid)


# @socketio.on("offline_friend_status")
# def offline_friend_status():
#     print(f'receive {user_info[sid_reference[request.sid]]["username"]} update offline status')
#     # send "online-status" event to friends on-line
#     user_id = sid_reference[request.sid]
#     friend_list = user_info[user_id]["friend_list"]
#     friend_sid_online = []
#     for friend in friend_list:
#         friend_id = int(friend["user_id"])
#         if friend_id in user_info.keys():
#             friend_sid = user_info[friend_id]["sid"]
#             friend_sid_online.append(friend_sid)

#     my_user_info = {
#         "user_id": user_id,
#         "username": user_info[user_id]["username"],
#         "sid": request.sid,
#         "email": user_info[user_id]["email"]
#     }

#     for sid in friend_sid_online:
#         emit("offline_friend_status", my_user_info, to=sid)



@socketio.on("alert")
def alert(data):
    emit("alert", data, to=data["receiver_sid"])