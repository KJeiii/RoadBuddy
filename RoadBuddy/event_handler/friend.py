from flask_socketio import emit
from RoadBuddy import socketio
from flask import request
import RoadBuddy.event_handler
from RoadBuddy.models.message import MessageTool

messageTool = MessageTool()

@socketio.on("friend_reqeust")
def friend_request(invitation_from_sender):
    sender_id = int(invitation_from_sender.get("senderID"))
    sender_sid = request.sid
    receivers_in_travel = []
    for receiver_id in invitation_from_sender["receiverIDs"]:
        is_receiver_online = RoadBuddy.event_handler.online_users.is_user_online(receiver_id)
        is_receiver_in_traveling = RoadBuddy.event_handler.online_users.is_user_traveling(receiver_id)
        (sender_name, sender_email, *rest) = RoadBuddy.event_handler.online_users.get_user_information(sender_id).values()
        if is_receiver_online and not is_receiver_in_traveling:
            sender_data = {
                "sid": sender_sid,
                "user_id": sender_id,
                "username": sender_name,
                "email": sender_email
            }
            emit("friend_request", sender_data, to=RoadBuddy.event_handler.online_users.get_user_sid(receiver_id))

        if is_receiver_in_traveling:
            receivers_in_travel.append(receiver_id)
            
    if len(receivers_in_travel) != 0:
        messageTool.Create_message(sender_id, receivers_in_travel)


@socketio.on("friend_request_result")
def friend_request_result(reply_from_receiver):
    # emit event "friend_request_result" to client (sender)
    is_sender_online = RoadBuddy.event_handler.online_users.is_user_online(int(reply_from_receiver["senderID"]))
    if is_sender_online:
        emit("friend_request_result", reply_from_receiver, to=RoadBuddy.event_handler.online_users.get_user_sid(int(reply_from_receiver["senderID"])))    


@socketio.on("initial_friend_status")
def initial_friend_status():
    # get online friends data for user first time login
    friend_list = RoadBuddy.event_handler.online_users.get_user_information(RoadBuddy.event_handler.online_users.get_user_id(request.sid)).get("friend_list")
    online_friend_list = []
    for friend in friend_list:
        friend_id = int(friend["user_id"])
        if RoadBuddy.event_handler.online_users.is_user_online(friend_id):
            friend_information = RoadBuddy.event_handler.online_users.get_user_information(friend_id)
            online_friend_list.append(
                {"user_id": friend_id,
                "user_sid": friend_information.get("sid"),
                "username": friend_information.get("username")
                })

    emit("update_friend_status", 
         {"update-type": "online", "online_friend_list": online_friend_list}, 
         to=request.sid)


@socketio.on("online_friend_status")
def online_friend_status():
    # send "online_friend_status" event to friends on-line
    # 1. collect all friends online
    user_id = RoadBuddy.event_handler.online_users.get_user_id(request.sid)
    friend_list = RoadBuddy.event_handler.online_users.get_user_information(user_id).get("friend_list")
    online_friend_sid_list = []
    for friend in friend_list:
        friend_id = int(friend["user_id"])
        notMe = friend_id != user_id
        if RoadBuddy.event_handler.online_users.is_user_online(friend_id) and notMe:
            online_friend_sid_list.append(RoadBuddy.event_handler.online_users.get_user_sid(friend_id))

    # 2. emit socket event to update_friend_status
    my_online_information = {
        "update-type" : "online", 
        "online_friend_list": [{
            "user_id": user_id,
            "user_sid": request.sid,
            "username": RoadBuddy.event_handler.online_users.get_user_information(user_id).get("username")}]
    }
    for friend_sid in online_friend_sid_list:
        emit("update_friend_status", my_online_information, to = friend_sid)
