from flask import Blueprint, render_template, request, jsonify
from RoadBuddy.models import team

teamTool = team.TeamTool()
team_bp = Blueprint("team_bp",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

# Load team list
@team_bp.route("/api/team", methods = ["POST", "PUT"])
def Team():
    if request.method == "PUT":
        try:
            user_id = request.json["user_id"]
            created_team_list = teamTool.Search_team_by_userid(user_id)
            joined_team_list = teamTool.Search_joined_team(user_id)
            response = {
                "ok": True,
                "data": {
                    "created_team": created_team_list,
                    "joined_team": joined_team_list
                }
            }
            return jsonify(response), 200
        
        except Exception as error:
            print(f'Error in controller(team) - Team : {error}')
            response = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(response), 500