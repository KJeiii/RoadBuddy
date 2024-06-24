from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import socketio
from flask import request, session
import RoadBuddy.event_handler
from RoadBuddy.models.message import MessageTool

messageTool = MessageTool()

@socketio.on("friend_reqeust")
def friend_request(data):
    sender_id = int(data.get("senderID"))
    sender_sid = request.sid
    receivers_in_travel = []

    for receiver_id in data["receiverIDs"]:
        is_receiver_online = RoadBuddy.event_handler.user_info.get(receiver_id) != None
        is_receiver_in_traveling = RoadBuddy.event_handler.user_info.get(receiver_id).get("team_id") != None if is_receiver_online else False

        if is_receiver_online and not is_receiver_in_traveling:
            sender_data = {
                "sid": sender_sid,
                "user_id": sender_id,
                "username": RoadBuddy.event_handler.user_info[sender_id]["username"],
                "email": RoadBuddy.event_handler.user_info[sender_id]["email"]
            }
            emit("friend_request", sender_data, to=RoadBuddy.event_handler.user_info[receiver_id]["sid"])

        if is_receiver_in_traveling:
            receivers_in_travel.append(receiver_id)
            
    if len(receivers_in_travel) != 0:
        messageTool.Create_message(sender_id, receivers_in_travel)
        RoadBuddy.event_handler.user_info[sender_id]["message"] = messageTool.Search_message(sender_id)
        emit("update_message", to=RoadBuddy.event_handler.user_info.get(sender_id).get("sid"))



@socketio.on("friend_request_result")
def friend_request_result(data):
    # organize data and emit event "friend_request_result" to client (sender)
    is_sender_online = RoadBuddy.event_handler.user_info.get(int(data["senderID"])) != None
    if is_sender_online:
        emit("friend_request_result", data, to=RoadBuddy.event_handler.user_info[int(data["senderID"])]["sid"])


@socketio.on("initial_friend_status")
def initial_friend_status():
    # get online friends data for user first time login
    user_id = RoadBuddy.event_handler.sid_reference[request.sid]
    friend_list = RoadBuddy.event_handler.user_info[user_id]["friend_list"]
    online_friend_list = []
    
    for friend in friend_list:
        friend_id = int(friend["user_id"])
        if friend_id in RoadBuddy.event_handler.user_info.keys():
            online_friend_list.append(
                {"user_id": friend_id,
                "user_sid": RoadBuddy.event_handler.user_info[friend_id]["sid"],
                "username": RoadBuddy.event_handler.user_info[friend_id]["username"]
                })

    emit("update_friend_status", 
         {"update-type" : "online",
            "online_friend_list": online_friend_list}, 
         to=request.sid)


@socketio.on("online_friend_status")
def online_friend_status():
    # send "online_friend_status" event to friends on-line
    # 1. collect all friends online
    user_id = RoadBuddy.event_handler.sid_reference[request.sid]
    friend_list = RoadBuddy.event_handler.user_info[user_id]["friend_list"]
    friend_sid_online = []
    for friend in friend_list:
        friend_id = int(friend["user_id"])
        if friend_id in RoadBuddy.event_handler.user_info.keys() and friend_id != user_id:
            friend_sid = RoadBuddy.event_handler.user_info[friend_id]["sid"]
            friend_sid_online.append(friend_sid)

    # 2. emit socket event to update_friend_status
    for sid in friend_sid_online:
        emit("update_friend_status",
             {"update-type" : "online", 
              "online_friend_list": [{
                  "user_id": user_id,
                  "user_sid": request.sid,
                  "username": RoadBuddy.event_handler.user_info[user_id]["username"]}]},  
             to=sid)


@socketio.on("alert")
def alert(data):
    emit("alert", data, to=data["receiver_sid"])