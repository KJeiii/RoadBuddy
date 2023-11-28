from flask import Blueprint, render_template, request, jsonify
from RoadBuddy.models import friend

friendsTool = friend.FriendTool()
friends_bp = Blueprint("friends_bp",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

# Load friends list
@friends_bp.route("/api/friends", methods = ["POST"])
def Load_friends_list():
    if request.method == "POST":
        try:
            user_id = request.json["user_id"]
            friends_list = friendsTool.Load_friends_list(user_id)
            response = {
                "ok": True,
                "data": friends_list 
            }
            return jsonify(response), 200
        
        except Exception as error:
            print(f'Error in controller(friend) - Load_friends_list : {error}')
            response = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(response), 500
    


