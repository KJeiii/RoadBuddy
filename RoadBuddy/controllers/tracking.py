from flask import Blueprint, render_template, redirect, url_for, request, jsonify, session
from RoadBuddy.models import team

tracking_bp = Blueprint("tracking_bp",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

# Load team list
@tracking_bp.route("/api/tracking", methods = ["POST"])
def tracking():
    session.clear()
    # print(f'session after clearance : {session}')
    # print(f'request method for user ({request.form.get("username")}) : {request.method}')
    # print(f'rooms_info at beginning of room : {rooms_info}')

    if request.method == "POST":

        username = request.form.get("username")
        roomID = request.form.get("roomID")
        create = request.form.get("create", False)
        join = request.form.get("join", False)

        # print(f'(beginning for room) create/join statusfor user ({request.form.get("username")}) : {create}, {join}')

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

        # print(f'session after build : {session}')
        print(rooms_info)


        return redirect(url_for("tracking"))

    return render_template("room.html")