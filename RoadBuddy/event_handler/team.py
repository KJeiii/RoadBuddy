from flask_socketio import SocketIO, emit, send, join_room, leave_room, rooms
from RoadBuddy import socketio
from flask import request, session
from RoadBuddy.event_handler import sid_reference, user_info, rooms_info


# Listener for receiving event "team request" from server
@socketio.on("team_request")
def team_request(data):
    sender_sid = data["sender_sid"]
    sender_id = sid_reference[sender_sid]

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



# Listener for receiving event "enter team" from server
@socketio.on("enter_team")
def enter_team(data):
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
                emit("add_partner", sid_reference[request.sid], to=team_id)

            else:
                print(f'{team_id} has not created by owner yet')



# Listener for receiving event "leave team" from server
@socketio.on("leave_team")
def leave_team(data):
    team_id = data["team_id"]
    sid = data["sid"]
    user_id = int(data["user_id"])

    leaving_partner_data = {
        "sid": sid,
        "user_id": user_id,
        "username": data["username"],
        "email": data["email"]
    }
    emit("leave_team", leaving_partner_data, to=team_id)
    emit("remove_partner", leaving_partner_data, to=team_id)

    leave_room(team_id)
    del rooms_info[team_id][sid]
    del user_info[user_id]["team_id"]

    if len(rooms_info[team_id].keys()) <= 0:
        del rooms_info[team_id]



# Listener for receiving event "alert" from server
@socketio.on("alert")
def alert(data):
    emit("alert", data, to=data["team_id"])




    