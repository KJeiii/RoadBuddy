from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import socketio
from flask import request, session
from RoadBuddy.event_handler.connect import sid_reference, user_info

@socketio.on("team_request")
def team_request(data):
    sender_sid = data["sender_sid"]
    sender_id = sid_reference[sender_sid]
    print(f'Server (team_request) team request from {user_info[sender_id]["username"]}')

    for id in data["receiver_id"]:
        sender_data = {
            "sid": sender_sid,
            "user_id": sender_id,
            "username": user_info[sender_id]["username"],
            "email": user_info[sender_id]["email"],
            "team_id": data["team_id"]
        }
        emit("team_request", sender_data, to=user_info[id]["sid"])
        print(f'{user_info[sender_id]["username"]} sends team request to {user_info[id]["username"]}')


@socketio.on("join_team")
def join_team(data):
    receiver_sid = data["receiver_sid"]
    receiver_id = sid_reference[receiver_sid]
    team_id = data["team_id"]
    print(f'Get team response from {user_info[receiver_id]}')

    if data["accept"]:
        join_room(team_id)
        print(f'{user_info[receiver_id]} enter team {team_id}')


@socketio.on("alert")
def alert(data):
    print(f'{data["username"]} send {data["msg"]} to team {data["team_id"]}')
    emit("alert", data, to=data["team_id"])


@socketio.on("leave_team")
def leave_team(data):
    leave_room(data["team_id"])


    