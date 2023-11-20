from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit, send, join_room, leave_room

app = Flask(__name__)
app.secret_key = "3b62657d32897eb69f59c089f0950dbe1ce4fd13"
socketio = SocketIO(app, logger=True)

partners_info = {}

user_info = {}
# user_info = {
#   sid-1 : {
#           username: XXXX,
#           roomID:XXXX,
#           coords: [{old postion}, {new position}]
#           },
#   sid-2 : {
#           username: XXXX,
#           roomID:XXXX,
#           coords: [{old postion}, {new position}]
#           }
# .......
# }

room_list = []
# room_list = [roomID-1, roomID-2, .....]

rooms_info = {}
# rooms_info = {
#   room_id-1: {
#       sid-1 : {username: XXX,
#              coords: [old_Postion, new_postion]
#             },
#       sid-2 : {username: XXX,
#              coords: [old_Postion, new_postion]
#             },
#   room_id-2: {
#       sid-1 : {username: XXX,
#              coords: [old_Postion, new_postion]
#             },
#       sid-2 : {username: XXX,
#              coords: [old_Postion, new_postion]
#             },
# }


@app.route("/", methods = ["POST", "GET"])
def room():
    session.clear()
    print(f'session after clearance : {session}')
    print(f'request method for user ({request.form.get("username")}) : {request.method}')
    print(f'rooms_info at beginning of room : {rooms_info}')

    if request.method == "POST":

        username = request.form.get("username")
        roomID = request.form.get("roomID")
        create = request.form.get("create", False)
        join = request.form.get("join", False)

        print(f'(beginning for room) create/join statusfor user ({request.form.get("username")}) : {create}, {join}')

        if not username or not roomID:
            print("Either Username or roomID is empty.")
            return redirect(url_for("room"))
        
        if create != False and roomID in rooms_info.keys():
            print(f'{roomID} has already exist.')
            return redirect(url_for("room"))
        
        if join != False and roomID not in rooms_info.keys():
            print(f'{roomID} has not builded yet.')
            return redirect(url_for("room"))

        if roomID not in rooms_info.keys():
            rooms_info[roomID] = {}
            print(roomID == list(rooms_info.keys())[0])

        session["username"] = username
        session["roomID"] = roomID
        session["create"] = create
        session["join"] = join
        # session["initial_latitude"] = float(request.form.get("initial_position").split(",")[0])
        # session["initial_longtitude"] = float(request.form.get("initial_position").split(",")[1])

        print(f'session after build : {session}')
        print(rooms_info)


        return redirect(url_for("tracking"))

    return render_template("room.html")




@app.route("/tracking")
def tracking():
    if session.get("username") == None or session.get("roomID") == None:
        return render_template("room.html")
    
    return render_template("tracking.html")



@socketio.on("connect")
def connect():
    username = session.get("username")
    roomID = session.get("roomID")

    print(f'(socketio for connect) create/join status for user( {username} ): {session["create"]}, {session["join"]}')

    if not username or not roomID:
        return
    
    if roomID not in rooms_info.keys():
        leave_room(roomID)
        return

    try: 
        # add new member to particular room
        rooms_info[roomID][request.sid] = {
            "username": username,
            "coords": [
                # {
                #     "latitude" : session["initial_latitude"],
                #     "longtitude" : session["initial_longtitude"]
                # }
                ]
        }

        print(f'rooms_info after create/join : {rooms_info}')

        print(f'the roomID ({roomID}) before user ({username}) joins')
        join_room(roomID)
        emit("message", 
            f'new team created : {roomID}\n' + 
            f'new partner joins : {username}\n'
            #   f'total partners: {len(rooms_info.keys())}'
            ,to=room)


    except Exception as error:
        print(f'error in socketio event(connect): {error}')

    # if session["create"] != False:
    #     # add new room to rooms_info
    #     rooms_info[roomID] = {
    #         request.sid: {
    #             "username": username,
    #             "coords": [
    #                 # {
    #                 #     "latitude" : session["initial_latitude"],
    #                 #     "longtitude" : session["initial_longtitude"]
    #                 # }
    #                 ]
    #         }
    #     }
    #     print(f'create new room: {rooms_info}')

    # if session["join"] != False:
    #     # add new member to particular room
    #     rooms_info[roomID][request.sid] = {
    #         "username": username,
    #         "coords": [
    #             # {
    #             #     "latitude" : session["initial_latitude"],
    #             #     "longtitude" : session["initial_longtitude"]
    #             # }
    #             ]
    #     }
    #     print(f'new member join room: {rooms_info}')




@socketio.on("disconnect")
def disconnect():
    userID = request.sid
    username = session.get("username")
    roomID = session.get("roomID")

    print(f'socketio event (disconnect) : username ({username}), roomID ({roomID})')
    
    leave_room(roomID)
    del rooms_info[roomID][userID]

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
        emit("movingPostion", rooms_info[roomID], to=roomID)

    if len(user_coords) == 1 :
        user_coords.append(new_coord)
        emit("movingPostion", rooms_info[roomID], to=roomID)

    if len(user_coords) == 0 :
        user_coords.append(new_coord)
        emit("initPosition", rooms_info[roomID], to=roomID)

    # print(user_coords)




socketio.run(app, debug=True, port=3000)