from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit, send, join_room, leave_room

app = Flask(__name__)
app.secret_key = "3b62657d32897eb69f59c089f0950dbe1ce4fd13"
socketio = SocketIO(app)

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
    if request.method == "POST":
        session["username"] = request.form.get("username")
        session["roomID"] = request.form.get("roomID")
        session["initial_latitude"] = float(request.form.get("initial_position").split(",")[0])
        session["initial_longtitude"] = float(request.form.get("initial_position").split(",")[1])
        session["create"] = request.form.get("create", False)
        session["join"] = request.form.get("join", False)

        print(session)

        # if create != False:
        #     rooms_info[username] = {
        #         'roomID' : roomID,
        #         'coords' : [
        #             {
        #                 "latitude" : initial_latitude,
        #                 "longtitude" : initial_longtitude
        #             }
        #         ]
        #     }

        return redirect(url_for("tracking"))

    return render_template("room.html")




@app.route("/tracking")
def tracking():
    if session.get("username") == None or session.get("roomID") == None:
        return render_template("room.html")
    
    return render_template("tracking.html")



@socketio.on("connect")
def connect():

    if session["create"] != False:
        # add new user in user_info
        # user_info[request.sid] = {
        #     "username": session["username"],
        #     "roomID": session["roomID"],
        #     'coords' : [
        #         {
        #             "latitude" : session["initial_latitude"],
        #             "longtitude" : session["initial_longtitude"]
        #         }]
        # }

        # add new room to rooms_info
        rooms_info[session["roomID"]] = {
            request.sid: {
                "username": session["username"],
                "coords": [
                    # {
                    #     "latitude" : session["initial_latitude"],
                    #     "longtitude" : session["initial_longtitude"]
                    # }
                    ]
            }
        }

        # add new room in room_list
        room_list.append(session["roomID"])

        print(rooms_info)
        # print(user_info)

        join_room(session["roomID"])
        socketio.emit("message", 
                    f'new team created : {room_list[len(room_list)-1]}\n' + 
                    f'new partner joins : {rooms_info[session["roomID"]][request.sid]["username"]}\n'
                    #   f'total partners: {len(rooms_info.keys())}'
                    ,to=room)

    if session["join"] != False:
        # add new user in user_info
        # user_info[request.sid] = {
        #     session["username"]: {
        #         "username": session["username"],
        #         "roomID": session["roomID"],
        #         'coords' : [
        #             {
        #                 "latitude" : session["initial_latitude"],
        #                 "longtitude" : session["initial_longtitude"]
        #             }
        #         ]
        #     }
        # }

        # add new member to particular room
        rooms_info[session["roomID"]][request.sid] = {
            "username": session["username"],
            "coords": [
                {
                    "latitude" : session["initial_latitude"],
                    "longtitude" : session["initial_longtitude"]
                }]
        }


        print(user_info)

        join_room(session["roomID"])
        socketio.emit("message", 
                    f'new team created : {room_list[len(room_list)-1]}\n' + 
                    f'new partner joins : {user_info[request.sid]["username"]}\n'
                    #   f'total partners: {len(rooms_info.keys())}'
                    ,to=room)


@socketio.on("disconnect")
def disconnect():
    userID = request.sid
    del user_info[userID]
    # total_partners = partners_info.keys()

    socketio.emit("disconnect", userID)
    socketio.emit("message", 
                  f'partner leaves : {request.sid}\n'
                #   f'total partners: {total_partners}'
                  )


# @socketio.on("message")
# def message(data):
#     print(data)
#     send(data, broadcast=True)


@socketio.on("position")
def position(position):

    userID = request.sid
    # user_coords = user_info[userID]["coords"]
    roomID = position["roomID"]
    new_coord = position["coord"]
    user_coords = rooms_info[roomID][userID]["coords"]


    if len(user_coords) < 2:
        # user_coords.append(position)
        # socketio.emit("initPosition", user_info)
        user_coords.append(new_coord)
        socketio.emit("initPosition", rooms_info[roomID], to=room)

    if len(user_coords) >= 2:
        del user_coords[0]
        user_coords.append(new_coord)
        socketio.emit("movingPostion", rooms_info[roomID], to=room)

    print(user_coords)




socketio.run(app, debug=True)