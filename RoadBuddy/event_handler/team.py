from flask_socketio import SocketIO, emit, send, join_room, leave_room, rooms
from RoadBuddy import socketio
from flask import request, session
from RoadBuddy.event_handler import sid_reference, user_info, rooms_info

@socketio.on("team_request")
def team_request(data):
    sender_sid = data["sender_sid"]
    sender_id = sid_reference[sender_sid]
    print(f'Server (team_request) team request from {user_info[sender_id]["username"]}')

    for id in data["receiver_id"]:
        sender_info = {
            "sid": sender_sid,
            "user_id": sender_id,
            "username": user_info[sender_id]["username"],
            "email": user_info[sender_id]["email"],
            "team_id": data["team_id"]
        }
        emit("team_request", sender_info, to=user_info[id]["sid"])
        print(f'{user_info[sender_id]["username"]} sends team request to {user_info[id]["username"]}')


@socketio.on("enter_team")
def enter_team(data):
    receiver_sid = data["receiver_sid"]
    receiver_id = sid_reference[receiver_sid]
    sender_sid = data["sender_info"]["sid"]
    sender_id = sid_reference[sender_sid]
    team_id = data["team_id"]
    print(f'Get team response from {user_info[receiver_id]}')

    # team owner create team
    if data["accept"] & data["enter_type"] == "create":
        if team_id not in rooms_info.keys():
            rooms_info[team_id] = {}
            rooms_info[team_id][data["sender_info"]["sid"]] = []
            join_room(team_id)
            emit("enter_team", to=team_id)
            print(f'{user_info[sender_id]["username"]} builds team {rooms()}')
        else:
            print(f'{team_id} is in used')

    # partner join team
    if data["accept"] & data["enter_type"] == "join":
        if team_id in rooms_info.keys():
            rooms_info[team_id][data["receiver_sid"]] = []
            join_room(team_id)
            emit("enter_team", to=team_id)
            print(f'{user_info[receiver_id]["username"]} joins team {rooms()}')
        else:
            print(f'{team_id} has not created by owner yet')


@socketio.on("leave_team")
def leave_team(data):
    team_id = data["team_id"]
    sid = data["sid"]

    data = {
        "sid": data["sid"],
        "user_id": data["user_id"],
        "username": data["username"],
        "email": data["email"]
    }
    emit("leave_team", data, to=team_id)

    leave_room(team_id)
    del rooms_info[sid]
    print(f'{user_info[data["user_id"]]["username"]} leaves team {team_id}')


@socketio.on("alert")
def alert(data):
    emit("alert", data, to=data["team_id"])
    print(f'{data["username"]} send {data["msg"]} to team {rooms()}')






    