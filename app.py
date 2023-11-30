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







@socketio.on("connect")
def connect():
    username = session.get("username")
    roomID = session.get("roomID")

    # print(f'(socketio for connect) create/join status for user( {username} ): {session["create"]}, {session["join"]}')

    if not username or not roomID:
        return
    
    if roomID not in rooms_info.keys():
        leave_room(roomID)
        return

    try: 
        # add new member to particular room
        rooms_info[roomID][request.sid] = {
            "username": username,
            "coords": []
        }

        print(f'rooms_info after create/join : {rooms_info}')

        join_room(roomID)
        emit("message", f'new partner joins : {username}\n', to=roomID)


    except Exception as error:
        print(f'error in socketio event(connect): {error}')



@socketio.on("disconnect")
def disconnect():
    userID = request.sid
    username = session.get("username")
    roomID = session.get("roomID")

    
    leave_room(roomID)
    del rooms_info[roomID][userID]

    if len(rooms_info[roomID].keys()) == 0 :
        del rooms_info[roomID]

    emit("disconnect", userID, to=roomID)
    emit("message", f'partner leaves : {username}\n', to=roomID)



@socketio.on("position")
def position(position):

    userID = request.sid
    roomID = session.get("roomID")
    username = session.get("username")
    new_coord = position["coord"]
    user_coords = rooms_info[roomID][userID]["coords"]


    if len(user_coords) >= 2:
        del user_coords[0]
        user_coords.append(new_coord)
        print(rooms_info[roomID])
        emit("movingPostion", rooms_info[roomID], to=roomID)

    if len(user_coords) == 1 :
        user_coords.append(new_coord)
        print(rooms_info[roomID])
        emit("initPosition", rooms_info[roomID], to=roomID)

    if len(user_coords) == 0 :
        user_coords.append(new_coord)
        print(rooms_info[roomID])
        emit("initPosition", rooms_info[roomID], to=roomID)





socketio.run(app, debug=True, port=3000, allow_unsafe_werkzeug=True)