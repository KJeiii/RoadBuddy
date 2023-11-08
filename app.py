from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)
sockitio = SocketIO(app)

partners_coords = []

@app.route("/")
def msg():
    return render_template("index.html")


@sockitio.on("connect")
def connect():
    sockitio.emit("message", f'{request.sid} joined')


@sockitio.on("disconnect")
def disconnect():
    sockitio.emit("message", f'{request.sid} leaved')
    print("user disconnected")


@sockitio.on("message")
def message(data):
    print(data)
    send(data, broadcast=True)


@sockitio.on("position")
def position(own_position):
    partners_coords.append(own_position)
    print(partners_coords)
    emit("position", partners_coords, broadcast=True)
    emit("message", partners_coords, broadcast=True)



sockitio.run(app, debug=True)