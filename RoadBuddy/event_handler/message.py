from flask_socketio import emit
from RoadBuddy import socketio
from flask import request
from RoadBuddy.event_handler import sid_reference, user_info

@socketio.on("pair_sid")
def pair_sid(user_id_list):
    user_sid_dict = { id: user_info.get(id).get("sid") for id in user_id_list}
    emit("pair_sid", user_sid_dict, to=request.sid)