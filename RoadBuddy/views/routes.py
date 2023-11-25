from flask import render_template, request, session, redirect, url_for
from RoadBuddy import app

# route
@app.route("/")
def home():
    return render_template("home.html")


@app.route("/member")
def member():
    return render_template("member.html")