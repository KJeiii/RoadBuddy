from flask import Blueprint, render_template, redirect, url_for, request, jsonify, session
from RoadBuddy.models import member

tracking_bp = Blueprint("tracking_bp",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

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

# tracking
@tracking_bp.route("/api/tracking", methods = ["POST", "GET"])
def tracking():
    session.clear()
   
    print(f'rooms_info at beginning in tracking controller : {rooms_info}')
    print(f'json from tracking page fetch : {request.json}')

    if request.method == "POST":
        try:
            username = request.json["username"]
            user_id = request.json["user_id"]
            team_id = request.json["team_id"]
            team_name = request.json["team_name"]

            if not username or not team_id:
                print("Either Username or roomID is empty.")
                return redirect(url_for("room"))
            
            # if team_id in rooms_info.keys():
            #     print(f'{team_id} has already exist.')
            #     return redirect(url_for("room"))
            
            # if team_id not in rooms_info.keys():
            #     print(f'{team_id} has not builded yet.')
            #     return redirect(url_for("room"))

            if team_id not in rooms_info.keys():
                rooms_info[team_id] = {}
                print(team_id == list(rooms_info.keys())[0])

            session["username"] = username
            session["user_id"] = user_id
            session["team_name"] = team_name
            session["team_id"] = team_id
        

            # print(f'session after build : {session}')
            print(f'rooms_info after build in tracking controller : {rooms_info}')

            response = {
                "ok": True,
                "message": "Room initialization complete."
            }

            return jsonify(response), 200
        
        except Exception as error:
            print(f'Error in tracking controller : {error}')
            response = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(response), 500
