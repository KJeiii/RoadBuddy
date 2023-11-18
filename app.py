from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit, send, join_room, leave_room

app = Flask(__name__)
app.secret_key = "3b62657d32897eb69f59c089f0950dbe1ce4fd13"
socketio = SocketIO(app)

partners_info = {}
rooms = {}
# rooms = {
#   room_id: {
#       {username-1 : [old_Postion, new_postion]},
#       {username-2 : [old_Postion, new_postion]},
#   }
# }

@app.route("/", methods = ["POST", "GET"])
def room():
    if request.method == "POST":
        username = request.form.get("username")
        roomID = request.form.get("roomID")
        initial_latitude = float(request.form.get("initial_position").split(",")[0])
        initial_longtitude = float(request.form.get("initial_position").split(",")[1])
        create = request.form.get("create")
        join = request.form.get("join")

        print(
            username, 
            roomID,     
            initial_latitude, 
            initial_longtitude, 
            request.form.get("create", False),
            request.form.get("join", False)
            )

        session["username"] = username
        session["roomID"] = roomID

        if create != False:
            rooms[roomID] = {
                username : [
                    {
                        "latitude" : initial_latitude,
                        "longtitude" : initial_longtitude
                    }
                ]
            }
            print(roomID)
            return redirect(url_for("tracking"))

        if join != False & roomID in rooms.keys():
            return redirect(url_for("tracking"))

    return render_template("room.html")




@app.route("/tracking")
def tracking():
    if session.get("username") == None or session.get("roomID") == None:

        print("no info")
        return render_template("room.html")
    
    roomID = session.get("roomID")
    print(roomID)
    
    return render_template("tracking.html")



@socketio.on("connect")
def connect():
    roomID = session.get("roomID")
    join_room(roomID)

    partner_id_to_add = request.sid
    partners_info[partner_id_to_add] = []
    total_partners = partners_info.keys()

    socketio.emit("message", 
                  f'new team created : {roomID}\n' + 
                  f'new partner joins : {request.sid}\n' + 
                  f'total partners: {len(total_partners)}'
                  )


@socketio.on("disconnect")
def disconnect():
    partner_id_to_delete = request.sid
    del partners_info[partner_id_to_delete]
    total_partners = partners_info.keys()

    socketio.emit("disconnect", partner_id_to_delete)
    socketio.emit("message", 
                  f'partner leaves : {request.sid}\n' + 
                  f'total partners: {total_partners}'
                  )


# @socketio.on("message")
# def message(data):
#     print(data)
#     send(data, broadcast=True)


@socketio.on("position")
def position(position):
    user_id = request.sid

    print(len(partners_info[user_id]))

    if len(partners_info[user_id]) < 2:
        partners_info[user_id].append(position)
        socketio.emit("initPosition", partners_info)

    if len(partners_info[user_id]) >= 2:
        del partners_info[user_id][0]
        partners_info[user_id].append(position)
        socketio.emit("movingPostion", partners_info)

    print(partners_info)



socketio.run(app, debug=True)