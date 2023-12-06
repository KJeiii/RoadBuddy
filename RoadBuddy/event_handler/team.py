from flask_socketio import SocketIO, emit, send, join_room, leave_room, rooms
from RoadBuddy import socketio
from flask import request, session
from RoadBuddy.event_handler import sid_reference, user_info, rooms_info

@socketio.on("team_request")
def team_request(data):
    sender_sid = data["sender_sid"]
    sender_id = sid_reference[sender_sid]
    print(f'user_info in listener "team_request" : {user_info}')

    for id in data["receiver_info"]["receiver_id"]:
        sender_info = {
            "sid": sender_sid,
            "user_id": sender_id,
            "username": user_info[sender_id]["username"],
            "email": user_info[sender_id]["email"],
            "team_id": data["team_id"],
            "friends_color": data["receiver_info"]["receiver_color"]
        }
        emit("team_request", sender_info, to=user_info[id]["sid"])
        # print(f'{user_info[sender_id]["username"]} sends team request to {user_info[id]["username"]}')


@socketio.on("enter_team")
def enter_team(data):
    print(data)
    print(sid_reference)
    sender_sid = request.sid
    sender_id = sid_reference[sender_sid]
    user_sid = request.sid
    user_id = sid_reference[user_sid]
    team_id = data["team_id"]

    if data["accept"]:
        # team owner create team
        if data["enter_type"] == "create":
            if team_id not in rooms_info.keys():
                rooms_info[team_id] = {}
                rooms_info[team_id][request.sid] = []
                join_room(team_id)
                user_info[user_id]["team_id"] = team_id
                emit("enter_team", sid_reference, to=team_id)

            else:
                print(f'{team_id} is in used')

        # partner join team
        if data["enter_type"] == "join":
            if team_id in rooms_info.keys() and request.sid in data["receiver_sid"]:
                rooms_info[team_id][data["receiver_sid"]] = []
                join_room(team_id)
                user_info[user_id]["team_id"] = team_id
                emit("enter_team", sid_reference, to=team_id)

            else:
                print(f'{team_id} has not created by owner yet')


@socketio.on("leave_team")
def leave_team(data):
    team_id = data["team_id"]
    sid = data["sid"]
    user_id = data["user_id"]

    print(f'{team_id} ready to leave.')

    data = {
        "sid": sid,
        "user_id": user_id,
        "username": data["username"],
        "email": data["email"]
    }
    emit("leave_team", data, to=team_id)

    leave_room(team_id)
    del rooms_info[team_id][sid]
    del user_info[user_id]["team_id"]

    if len(rooms_info[team_id].keys()) <= 0:
        del rooms_info[team_id]
    print(f'team remaining : {rooms_info.keys()}')
    # print(f'after member left, rooms_info = {rooms_info}')


@socketio.on("alert")
def alert(data):
    emit("alert", data, to=data["team_id"])
    # print(f'{data["username"]} send {data["msg"]} to team {rooms()}')






    