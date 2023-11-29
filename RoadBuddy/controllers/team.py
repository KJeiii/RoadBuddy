from flask import Blueprint, render_template, request, jsonify
from RoadBuddy.models import team

teamTool = team.TeamTool()
team_bp = Blueprint("team_bp",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

# Load team list
@team_bp.route("/api/team", methods = ["POST"])
def Load_team_list():
    if request.method == "POST":
        try:
            print(request.json)
            owner_id = request.json["owner_id"]
            team_list = teamTool.Search_team_by_userid(owner_id)
            response = {
                "ok": True,
                "data": team_list
            }
            return jsonify(response), 200
        
        except Exception as error:
            print(f'Error in controller(team) - Load_team_list : {error}')
            response = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(response), 500