from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from RoadBuddy import app
from RoadBuddy.views.routes import *
from RoadBuddy.controllers.member import member_bp
from RoadBuddy.controllers.friend import friend_bp
from RoadBuddy.controllers.team import team_bp
from RoadBuddy.controllers.tracking import tracking_bp, rooms_info

app.register_blueprint(member_bp)
app.register_blueprint(friend_bp)
app.register_blueprint(team_bp)
app.register_blueprint(tracking_bp)


socketio = SocketIO(app, 
                    # logger=True, 
                    cors_allowed_origins="*", 
                    ping_timeout=60,
                    ping_interval=5
                    )

# rooms_info = {}
# # rooms_info = {
# #   room_id-1: {
# #       sid-1 : {username: XXX,
# #              coords: [old_Postion, new_postion]
# #             },
# #       sid-2 : {username: XXX,
# #              coords: [old_Postion, new_postion]
# #             },
# #   room_id-2: {
# #       sid-1 : {username: XXX,
# #              coords: [old_Postion, new_postion]
# #             },
# #       sid-2 : {username: XXX,
# #              coords: [old_Postion, new_postion]
# #             },
# # }




# @app.route("/room", methods = ["POST", "GET"])
# def room():
#     session.clear()
#     # print(f'session after clearance : {session}')
#     # print(f'request method for user ({request.form.get("username")}) : {request.method}')
#     # print(f'rooms_info at beginning of room : {rooms_info}')

#     if request.method == "POST":

#         username = request.form.get("username")
#         roomID = request.form.get("roomID")
#         create = request.form.get("create", False)
#         join = request.form.get("join", False)

#         # print(f'(beginning for room) create/join statusfor user ({request.form.get("username")}) : {create}, {join}')

#         if not username or not roomID:
#             print("Either Username or roomID is empty.")
#             return redirect(url_for("room"))
        
#         if create != False and roomID in rooms_info.keys():
#             print(f'{roomID} has already exist.')
#             return redirect(url_for("room"))
        
#         if join != False and roomID not in rooms_info.keys():
#             print(f'{roomID} has not builded yet.')
#             return redirect(url_for("room"))

#         if roomID not in rooms_info.keys():
#             rooms_info[roomID] = {}
#             print(roomID == list(rooms_info.keys())[0])

#         session["username"] = username
#         session["roomID"] = roomID
#         session["create"] = create
#         session["join"] = join
#         # session["initial_latitude"] = float(request.form.get("initial_position").split(",")[0])
#         # session["initial_longtitude"] = float(request.form.get("initial_position").split(",")[1])

#         # print(f'session after build : {session}')
#         print(rooms_info)


#         return redirect(url_for("tracking"))

#     return render_template("room.html")



user_info = {}
sid_reference ={}

@socketio.on("connect")
def connect():
    username = session.get("username")
    team_id = session.get("team_id")

    print(f'username and team_id in socket event (connect) : {username} / {team_id}')

    if not username or not team_id:
        return
    
    if team_id not in rooms_info.keys():
        leave_room(team_id)
        return

    try: 
        # add new member to particular room
        rooms_info[team_id][request.sid] = {
            "username": username,
            "coords": []
        }

        print(f'rooms_info after create/join : {rooms_info}')

        join_room(team_id)
        emit("message", f'new partner joins : {username}\n', to=team_id)


    except Exception as error:
        print(f'error in socketio event(connect): {error}')

@socketio.on("store_userinfo")
def store_userinfo(data):

    sid_reference[request.sid] = int(data["user_id"])
    user_info[int(data["user_id"])] = {
        "username": data["username"],
        "sid": request.sid,
        "email": data["email"]
    }

    print(f'sid_reference after socket event(store_userinfo) : {sid_reference}')
    print(f'user_info after socket event(store_userinfo) : {user_info}')


@socketio.on("friend_reqeust")
def friend_request(data):
    print(data)

    sender_sid = data["sender_sid"]
    sender_id = sid_reference[sender_sid]

    for id in data["receiver_id"]:
        sender_data = {
            "sid": sender_sid,
            "user_id": sender_id,
            "username": user_info[sender_id]["username"],
            "email": user_info[sender_id]["email"]
        }
        emit("friend_request", sender_data, to=user_info[id]["sid"])
        print(f'{user_info[sender_id]["username"]} sends request to {user_info[id]["username"]}')


@socketio.on("friend_request_result")
def friend_request_result(data):
    print(data)

    # 回寄給sender
    sender_sid = data["sender_info"]["sid"]
    receiver_id = sid_reference[data["receiver_sid"]]
    receiver_info = user_info[receiver_id]
    data = {
        "accept": data["accept"],
        "sender_sid": sender_sid,
        "receiver_info": {
            "user_id": receiver_id,
            "username": receiver_info["username"],
            "email": receiver_info["email"]
        }
    }
    emit("friend_request_result", data, to=sender_sid)



@socketio.on("disconnect")
def disconnect():

    del user_info[sid_reference[request.sid]]
    del sid_reference[request.sid]

    print(f'sid_reference after socket event(disconnect) : {sid_reference}')
    print(f'user_info after socket event(disconnect) : {user_info}')

    user_socket_id = request.sid
    username = session.get("username")
    team_id = session.get("team_id")

    
    leave_room(team_id)
    del rooms_info[team_id][user_socket_id]

    if len(rooms_info[team_id].keys()) == 0 :
        del rooms_info[team_id]

    emit("disconnect", user_socket_id, to=team_id)
    emit("message", f'partner leaves : {username}\n', to=team_id)



@socketio.on("position")
def position(position):

    print(f'rooms_info in socket event (position) : {rooms_info}')
    user_socket_id = request.sid
    team_id = session.get("team_id")
    username = session.get("username")
    new_coord = position["coord"]
    user_coords = rooms_info[team_id][user_socket_id]["coords"]


    if len(user_coords) >= 2:
        del user_coords[0]
        user_coords.append(new_coord)
        print(rooms_info[team_id])
        emit("movingPostion", rooms_info[team_id], to=team_id)

    if len(user_coords) == 1 :
        user_coords.append(new_coord)
        print(rooms_info[team_id])
        emit("initPosition", rooms_info[team_id], to=team_id)

    if len(user_coords) == 0 :
        user_coords.append(new_coord)
        print(rooms_info[team_id])
        emit("initPosition", rooms_info[team_id], to=team_id)


@socketio.on("alert")
def alert(data):
    emit("alert", data, to=data["receiver_sid"])





socketio.run(app, debug=True, port=3000, allow_unsafe_werkzeug=True)