from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)
sockitio = SocketIO(app, cors_allowed_origins="*")

partners_info = {}

@app.route("/")
def msg():
    return render_template("index.html")


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



sockitio.run(app, debug=True, port=3000, allow_unsafe_werkzeug=True)