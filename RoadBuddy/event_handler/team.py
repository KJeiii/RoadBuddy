from flask_socketio import SocketIO, emit, send, join_room, leave_room, rooms
from RoadBuddy import socketio
from flask import request, session
import RoadBuddy.event_handler 


# Listener for receiving event "team request" from server
@socketio.on("team_invite")
def team_invite(data):
    sender_sid = data["sender_sid"]
    sender_id = RoadBuddy.event_handler.sid_reference[sender_sid]

    for id in data["receiver_info"]["receiver_id"]:
        sender_info = {
            "sid": sender_sid,
            "user_id": sender_id,
            "username": RoadBuddy.event_handler.user_info[sender_id]["username"],
            "email": RoadBuddy.event_handler.user_info[sender_id]["email"],
            "team_id": data["team_id"],
            "partners_color": data["receiver_info"]["receiver_color"]
        }
        emit("team_invite", sender_info, to=RoadBuddy.event_handler.user_info[id]["sid"])



# Listener for receiving event "enter team" from server
@socketio.on("enter_team")
def enter_team(data):
    sender_sid = request.sid
    sender_id = RoadBuddy.event_handler.sid_reference[sender_sid]
    user_sid = request.sid
    user_id = RoadBuddy.event_handler.sid_reference[user_sid]

    if data["accept"]:
        # team owner create team
        if data["enter_type"] == "create":
            team_id = data["team_id"]
            if team_id not in RoadBuddy.event_handler.rooms_info.keys():
                # rooms_info[team_id] = {}
                # rooms_info[team_id][request.sid] = []

                RoadBuddy.event_handler.rooms_info[team_id] = {
                    "owner_sid": request.sid,
                    "partner": {request.sid : []}
                }

                join_room(team_id)
                RoadBuddy.event_handler.user_info[user_id]["team_id"] = team_id
                emit("enter_team", RoadBuddy.event_handler.sid_reference, to=team_id)

            else:
                print(f'{team_id} is in used')

        # partner join team by owner invitation
        if data["enter_type"] == "join":
            team_id = data["team_id"]
            # if team_id in RoadBuddy.event_handler.rooms_info.keys() and request.sid in data["receiver_sid"]:
            # -> seems uneccesary to check request.sid in data["receiver_sid"], it must be true
             
            if team_id in RoadBuddy.event_handler.rooms_info.keys():
                RoadBuddy.event_handler.rooms_info[team_id]["partner"][request.sid] = []
                join_room(team_id)
                RoadBuddy.event_handler.user_info[user_id]["team_id"] = team_id
                emit("enter_team", RoadBuddy.event_handler.sid_reference, to=team_id)
                emit("add_partner", RoadBuddy.event_handler.sid_reference[request.sid], to=team_id)

            else:
                print(f'{team_id} has not created by owner yet')

        # owner accept request from new partner
        # if data["enter_type"] == "accept_request":
        #     team_id = RoadBuddy.event_handler.user_info[RoadBuddy.event_handler.sid_reference[request.sid]]["team_id"]

        #     info_for_new_partner = {
        #         "sender_info": {        
        #             "sid": request.sid,
        #             "user_id": RoadBuddy.event_handler.sid_reference[request.sid],
        #             "username": RoadBuddy.event_handler.user_info[RoadBuddy.event_handler.sid_reference[request.sid]]["username"],
        #             "email": RoadBuddy.event_handler.user_info[RoadBuddy.event_handler.sid_reference[request.sid]]["email"],
        #             "team_id": team_id,
        #             "partners_color": data["partners_color"]
        #         },
        #         "RoadBuddy.event_handler.sid_reference": RoadBuddy.event_handler.sid_reference,
        #         "requester_info": data["requester_info"]
        #      }
            
        #     emit("enter_team", info_for_new_partner, to=team_id)
        #     emit("add_partner", data["requester_info"]["user_id"], to=team_id)



# Listener for receiving event "leave team" from server
@socketio.on("leave_team")
def leave_team(data):
    team_id = data["team_id"]
    sid = data["sid"]
    user_id = int(data["user_id"])

    emit("leave_team", data, to=team_id)

    leave_room(team_id)
    del RoadBuddy.event_handler.rooms_info[team_id]["partner"][sid]
    del RoadBuddy.event_handler.user_info[user_id]["team_id"]

    if len(RoadBuddy.event_handler.rooms_info[team_id]["partner"].keys()) <= 0:
        del RoadBuddy.event_handler.rooms_info[team_id]
        team_online_list = list(RoadBuddy.event_handler.rooms_info.keys())
        emit("update_team_status", team_online_list, broadcast=True)


# update team using status when user login
@socketio.on("initial_team_status")
def initial_team_status():
    team_online_list = list(RoadBuddy.event_handler.rooms_info.keys())
    emit("update_team_status", team_online_list, to=request.sid)


# update team using status when other user start team
@socketio.on("update_team_status")
def update_team_status():
    team_online_list = list(RoadBuddy.event_handler.rooms_info.keys())
    user_id = RoadBuddy.event_handler.sid_reference[request.sid]
    friend_list = RoadBuddy.event_handler.user_info[user_id]["friend_list"]

    for friend in friend_list:
        friend_id = int(friend["user_id"])
        if friend_id in RoadBuddy.event_handler.user_info.keys():
            sid = RoadBuddy.event_handler.user_info[friend_id]["sid"]
            emit("update_team_status", team_online_list, to=sid)



# Event listener for receiving event "join_team_request" from frontend
# And emit event "join_team_request" to team owner in frontend 
@socketio.on("join_team_request")
def join_team_request(data):
    if data["team_id"] in RoadBuddy.event_handler.rooms_info.keys():
        team_owner_sid = RoadBuddy.event_handler.rooms_info[data["team_id"]]["owner_sid"]
        emit("join_team_request", data, to=team_owner_sid)


@socketio.on("accept_team_request")
def accept_team_request(data):
    if data["accept"]:
        requester_sid = data["requester_sid"]
        sender_info = {
            "sid": request.sid,
            "user_id": RoadBuddy.event_handler.sid_reference[request.sid],
            "username": RoadBuddy.event_handler.user_info[RoadBuddy.event_handler.sid_reference[request.sid]]["username"],
            "email": RoadBuddy.event_handler.user_info[RoadBuddy.event_handler.sid_reference[request.sid]]["email"],
            "team_id": RoadBuddy.event_handler.user_info[RoadBuddy.event_handler.sid_reference[request.sid]]["team_id"],
            "partners_color": data["partners_color"]
        }
        
        emit("accept_team_request", sender_info, to=requester_sid)
        



# Listener for receiving event "alert" from server
@socketio.on("alert")
def alert(data):
    emit("alert", data, to=data["team_id"])




    