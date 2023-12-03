from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import socketio
from flask import request, session
from RoadBuddy.event_handler.connect import sid_reference, user_info



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


@socketio.on("alert")
def alert(data):
    emit("alert", data, to=data["receiver_sid"])