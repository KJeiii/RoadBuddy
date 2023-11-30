from flask import render_template
from RoadBuddy import app

# route
@app.route("/")
def home():
    return render_template("home.html")


@app.route("/member")
def member():
    return render_template("member.html")


@app.route("/room")
def room():
    return render_template("room.html")


@app.route("/tracking")
def tracking(): 
    return render_template("tracking.html")