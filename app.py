from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)
app.secret_key = "3b62657d32897eb69f59c089f0950dbe1ce4fd13"
sockitio = SocketIO(app)

partners_info = {}
rooms = {}
# rooms = {
#   room_id: {
#       {username-1 : [old_Postion, new_postion]},
#       {username-2 : [old_Postion, new_postion]},
#   }
# }

@app.route("/", methods = ["POST", "GET"])
def build_room():
    if request.method == "POST":
        username = request.form.get("username")
        roomID = request.form.get("roomID")
        initial_position = request.form.get("initial_position")
        session["username"] = username
        session["roomID"] = roomID

        rooms[roomID] = {
            username : [initial_position]
        }

        print(rooms)

        return redirect(url_for("map"))

    return render_template("build_room.html")




@app.route("/map")
def map():
    if session.get("username") == None or session.get("roomID") == None:
        print("no info")
        return render_template("build_room.html")
    
    return render_template("map.html")



@sockitio.on("connect")
def connect():
    partner_id_to_add = request.sid
    partners_info[partner_id_to_add] = []
    total_partners = partners_info.keys()

    sockitio.emit("message", 
                  f'new partner joins : {request.sid}\n' + 
                  f'total partners: {total_partners}'
                  )


@sockitio.on("disconnect")
def disconnect():
    partner_id_to_delete = request.sid
    del partners_info[partner_id_to_delete]
    total_partners = partners_info.keys()

    sockitio.emit("disconnect", partner_id_to_delete)
    sockitio.emit("message", 
                  f'partner leaves : {request.sid}\n' + 
                  f'total partners: {total_partners}'
                  )


# @sockitio.on("message")
# def message(data):
#     print(data)
#     send(data, broadcast=True)


@sockitio.on("position")
def position(position):
    user_id = request.sid

    print(len(partners_info[user_id]))

    if len(partners_info[user_id]) < 2:
        partners_info[user_id].append(position)
        sockitio.emit("initPosition", partners_info)

    if len(partners_info[user_id]) >= 2:
        del partners_info[user_id][0]
        partners_info[user_id].append(position)
        sockitio.emit("movingPostion", partners_info)

    print(partners_info)



sockitio.run(app, debug=True)