from flask_socketio import SocketIO, emit, send, join_room, leave_room, rooms
from RoadBuddy import socketio
from flask import request, session
import RoadBuddy.event_handler 


# Listener for receiving event "team request" from server
@socketio.on("team_invite")
def team_invite(invitation):
    sender_sid = invitation["senderSID"]
    sender_id = RoadBuddy.event_handler.online_users.get_user_id(sender_sid)
    team_id = invitation["teamID"]

    for friend_id in invitation["friendIDsToInvite"]:
        sender_info = {
            **RoadBuddy.event_handler.online_users.get_user_information(sender_id),
            "user_id": sender_id,
            "coordination": invitation.get("senderCoordination"),
            "team_id": team_id,
            "image_url": invitation.get("senderImageUrl"),
            "icon_color": invitation.get("senderIconColor")
        }
        del sender_info["friend_list"]
        del sender_info["message_list"]
        emit("team_invite", sender_info, to=RoadBuddy.event_handler.online_users.get_user_sid(friend_id))


# Listener for receiving event "enter team" from server
@socketio.on("enter_team")
def enter_team(user_to_join_team):
    try:
        user_id = RoadBuddy.event_handler.online_users.get_user_id(request.sid)
        if user_to_join_team["accept"]:
            team_id = user_to_join_team["team_id"]
            team_is_online = team_id in RoadBuddy.event_handler.rooms_info.keys()
            # team owner create team
            if user_to_join_team["enter_type"] == "create" and not team_is_online:
                RoadBuddy.event_handler.rooms_info[team_id] = {
                    "owner_sid": request.sid,
                    "partners": {request.sid : {
                        "image_url": user_to_join_team.get("imageUrl"),
                        "icon_color": user_to_join_team.get("iconColor"),
                        "coordination": user_to_join_team.get("coordination"),
                        "username": RoadBuddy.event_handler.online_users.get_user_information(user_id).get("username"),
                        "user_id": user_id
                    }}
                }
                join_room(team_id)
                RoadBuddy.event_handler.online_users.update_user_information(user_id, team_id = team_id)

            # partner join team by owner invitation
            if user_to_join_team["enter_type"] == "join" and team_is_online:
                RoadBuddy.event_handler.rooms_info[team_id]["partners"][request.sid] = {
                    "image_url": user_to_join_team.get("imageUrl"),
                    "icon_color": user_to_join_team.get("iconColor"),
                    "coordination": user_to_join_team.get("coordination"),
                    "username": RoadBuddy.event_handler.online_users.get_user_information(user_id).get("username"),
                    "user_id": user_id
                }
                join_room(team_id)
                RoadBuddy.event_handler.online_users.update_user_information(user_id, team_id = team_id)
                partner = {
                    "user_id": user_id,
                    "sid": request.sid,
                    "username": RoadBuddy.event_handler.online_users.get_user_information(user_id).get("username"),
                    "image_url": user_to_join_team.get("imageUrl"),
                    "icon_color": user_to_join_team.get("iconColor"),
                    "coordination": user_to_join_team.get("coordination")
                }
                emit("add_partner", partner, to=team_id)
    except Exception as error:
        print("Failed to execute socket.on('enter_team'): ",error)


# Listener for receiving event "leave team" from server
@socketio.on("leave_team")
def leave_team(leaving_user):
    team_id = leaving_user["team_id"]
    sid = leaving_user["sid"]
    user_id = int(leaving_user["user_id"])
    emit("leave_team", leaving_user, to=team_id)

    leave_room(team_id)
    del RoadBuddy.event_handler.rooms_info[team_id]["partners"][sid]
    RoadBuddy.event_handler.online_users.update_user_information(user_id, team_id = None)

    if len(RoadBuddy.event_handler.rooms_info[team_id]["partners"].keys()) <= 0:
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
    user_id = RoadBuddy.event_handler.online_users.get_user_id(request.sid)
    friend_list = RoadBuddy.event_handler.online_users.get_user_information(user_id).get("friend_list")

    for friend in friend_list:
        friend_id = int(friend["user_id"])
        if RoadBuddy.event_handler.online_users.is_user_online(friend_id):
            emit("update_team_status", team_online_list, to = RoadBuddy.event_handler.online_users.get_user_sid(friend_id))


# Event listener for receiving event "join_team_request" from frontend
# And emit event "join_team_request" to team owner 
@socketio.on("join_team_request")
def join_team_request(applicant):
    team_is_online = applicant["teamID"] in RoadBuddy.event_handler.rooms_info.keys()
    if team_is_online:
        team_owner_sid = RoadBuddy.event_handler.rooms_info[applicant["teamID"]]["owner_sid"]
        emit("join_team_request", applicant, to=team_owner_sid)


@socketio.on("accept_team_request")
def accept_team_request(accept_application_data):
    if accept_application_data["accept"]:
        applicant_sid = accept_application_data["applicantSID"]
        team_owner_id = RoadBuddy.event_handler.online_users.get_user_id(request.sid)
        team_id = RoadBuddy.event_handler.online_users.get_user_information(team_owner_id).get("team_id")
        accept_application_response = {
            "team_id": team_id,
            "partners": RoadBuddy.event_handler.rooms_info.get(team_id).get("partners")
        }
        emit("accept_team_request", accept_application_response, to=applicant_sid)
        




    