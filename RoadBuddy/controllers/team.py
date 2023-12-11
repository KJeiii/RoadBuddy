from flask import Blueprint, render_template, request, jsonify
from RoadBuddy.models import team

teamTool = team.TeamTool()
team_bp = Blueprint("team_bp",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

# Load team list
@team_bp.route("/api/team", methods = ["POST", "PUT", "PATCH"])
def Team():
    # PUT method: search team that use created and joined
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
            print(f'Error in controller(team) - Team(PUT method) : {error}')
            response = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(response), 500
        
    # POST method: create a new team
    if request.method == "POST":
        try:
            team_name = request.json["team_name"]
            user_id = request.json["user_id"]
            search_team = teamTool.Search_team_by_teamname(team_name)

            if len(search_team) != 0 :
                response = {
                    "error": True,
                    "message": "隊伍名稱已被使用"
                }
                return jsonify(response), 400

            teamTool.Create_team(team_name, user_id)

            response = {
                "ok": True,
                "message": "success"
            }
            return jsonify(response), 200

        except Exception as error:
            print(f'Error in controller(team) - Team(POST method) : {error}')
            response = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(response), 500
    
    # PATCH method : add new partner in team created already
    if request.method == "PATCH":
        try:
            team_id = request.json["team_id"]
            partner_id = request.json["user_id"]

            not_join_yet = True if len(teamTool.Search_joined_team(partner_id)) < 1 else False

            if not_join_yet:
                teamTool.Add_partner(
                    team_id = team_id,
                    partner_id = partner_id
                )

                response = {
                    "ok": True,
                    "message": "success"
                }
                return jsonify(response), 200
            
            response = {
                "error": True,
                "message": "曾經已是隊員"
            }
            return jsonify(response), 400
        
        except Exception as error:
            print(f'Error in controller(team) - Team(PATCH method) : {error}')
            response = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(response), 500            
