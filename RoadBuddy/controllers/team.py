from flask import Blueprint, request, jsonify
from RoadBuddy.models import team

teamTool = team.TeamTool()
team_bp = Blueprint("team_bp",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

# Load team list
@team_bp.route("/api/team", methods = ["POST", "GET", "PATCH"])
def Team():
    # GET method: search team that use created and joined
    if request.method == "GET": 
        try:
            user_id = int(request.args.get("userID"))
            if request.args.get("teamType") == "created":
                created_team_list = teamTool.Search_created_team(user_id)
                joined_team_list = []
                response = {
                    "ok": True,
                    "data": {
                        "created_team_list": created_team_list,
                        "joined_team_list": joined_team_list
                    }
                }
                return jsonify(response), 200
            
            if request.args.get("teamType") == "joined":
                created_team_list = []
                joined_team_list = teamTool.Search_joined_team(user_id)
                response = {
                    "ok": True,
                    "data": {
                        "created_team_list": created_team_list,
                        "joined_team_list": joined_team_list
                    }
                }
                return jsonify(response), 200

        
        except Exception as error:
            print(f'Error in controller(team) - Team(PUT method) : {error}')
            response = {
                "error": True,
                "message": "Internal server error"
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
                    "message": "The team name has been used."
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
                "message": "Internal server error"
            }
            return jsonify(response), 500
    
    # PATCH method : add new partner in team created already
    if request.method == "PATCH":
        try:
            team_id = int(request.json["team_id"])
            partner_id = int(request.json["user_id"])
            joined_teams = teamTool.Search_joined_team(partner_id)
            
            not_join_yet = True
            for team in joined_teams:
                if team["team_id"] == team_id:
                    not_join_yet = False

            if not_join_yet:
                teamTool.Add_partner(
                    team_id = team_id,
                    partner_id = [partner_id]
                )

                response = {
                    "ok": True,
                    "message": "success"
                }
                return jsonify(response), 200
            
            response = {
                "error": True,
                "message": "You have been in partnership already."
            }
            return jsonify(response), 200
        
        except Exception as error:
            print(f'Error in controller(team) - Team(PATCH method) : {error}')
            response = {
                "error": True,
                "message": "Internal server error"
            }
            return jsonify(response), 500            
