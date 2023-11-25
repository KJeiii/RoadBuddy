from flask import render_template
from RoadBuddy import app

# route
@app.route("/")
def home():
    return render_template("home.html")


@app.route("/member")
def member():
    return render_template("member.html")