from flask_socketio import emit, join_room, leave_room
from RoadBuddy import socketio
from flask import request
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
            (*rest, team_id, image_url, icon_color, coordination) = user_to_join_team.values()
            partner = {
                "sid": request.sid,
                "user_id": user_id,
                "username": RoadBuddy.event_handler.online_users.get_user_information(user_id).get("username"),
                "image_url": image_url,
                "icon_color": icon_color,
                "coordination": coordination
            }
            # team owner create team
            if user_to_join_team["enter_type"] == "create" and \
            not RoadBuddy.event_handler.online_teams.is_team_online(team_id):
                RoadBuddy.event_handler.online_teams.append_team(team_id, request.sid)
                RoadBuddy.event_handler.online_teams.append_partner(team_id = team_id, **partner)
                join_room(team_id)
                RoadBuddy.event_handler.online_users.update_user_information(user_id, team_id = team_id)

            # partner joining team
            if user_to_join_team["enter_type"] == "join" and RoadBuddy.event_handler.online_teams.is_team_online(team_id):
                RoadBuddy.event_handler.online_teams.append_partner(team_id=team_id, **partner)
                join_room(team_id)
                RoadBuddy.event_handler.online_users.update_user_information(user_id, team_id = team_id)
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
    RoadBuddy.event_handler.online_teams.remove_partner(team_id, sid)
    RoadBuddy.event_handler.online_users.update_user_information(user_id, team_id = None)

    if RoadBuddy.event_handler.online_teams.get_partner_amount(team_id) <= 0:
        RoadBuddy.event_handler.online_teams.remove_team(team_id)
        team_online_list = RoadBuddy.event_handler.online_teams.get_all_team_ids()
        emit("update_team_status", team_online_list, broadcast=True)


# update team using status when user login
@socketio.on("initial_team_status")
def initial_team_status():
    emit("update_team_status", RoadBuddy.event_handler.online_teams.get_all_team_ids(), to=request.sid)


# update team using status when other user start team
@socketio.on("update_team_status")
def update_team_status():
    user_id = RoadBuddy.event_handler.online_users.get_user_id(request.sid)
    friend_list = RoadBuddy.event_handler.online_users.get_user_information(user_id).get("friend_list")

    for friend in friend_list:
        friend_id = int(friend["user_id"])
        if RoadBuddy.event_handler.online_users.is_user_online(friend_id):
            emit("update_team_status", 
                 RoadBuddy.event_handler.online_teams.get_all_team_ids(), 
                 to = RoadBuddy.event_handler.online_users.get_user_sid(friend_id))


# Event listener for receiving event "join_team_request" from frontend
# And emit event "join_team_request" to team owner 
@socketio.on("join_team_request")
def join_team_request(applicant):
    if RoadBuddy.event_handler.online_teams.is_team_online(applicant.get("teamID")):
        emit("join_team_request", 
             applicant, 
             to=RoadBuddy.event_handler.online_teams.get_team_owner_sid(applicant.get("teamID")))


@socketio.on("accept_team_request")
def accept_team_request(accept_application_data):
    if accept_application_data["accept"]:
        applicant_sid = accept_application_data["applicantSID"]
        team_owner_id = RoadBuddy.event_handler.online_users.get_user_id(request.sid)
        team_id = RoadBuddy.event_handler.online_users.get_user_information(team_owner_id).get("team_id")
        accept_application_response = {
            "team_id": team_id,
            "partners": RoadBuddy.event_handler.online_teams.get_all_partner_information(team_id)
        }
        emit("accept_team_request", accept_application_response, to=applicant_sid)
        




    