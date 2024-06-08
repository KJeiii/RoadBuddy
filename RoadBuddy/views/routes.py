from flask import render_template
from RoadBuddy import app

# route
@app.route("/")
def landing():
    return render_template("landing.html")


@app.route("/member")
def member():
    return render_template("member.html")


@app.route("/main")
def main():
    return render_template("main.html")
