from flask import Blueprint, render_template, request, jsonify
from RoadBuddy.models import friend, member

friendTool = friend.FriendTool()
memberTool = member.MemberTool()

friend_bp = Blueprint("friend_bp",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

# Load friends list and find new friends
@friend_bp.route("/api/friend", methods = ["POST"])
def Load_friend_list():
    if request.method == "POST":
        try:
            user_id = request.json["user_id"]
            friend_list = friendTool.Load_friend_list(user_id)
            response = {
                "ok": True,
                "data": friend_list 
            }
            return jsonify(response), 200
        
        except Exception as error:
            print(f'Error in controller(friend) - Load_friend_list : {error}')
            response = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(response), 500
    

@friend_bp.route("/api/friend/search", methods = ["POST"])
def Search_new_friend():
    if request.method == "POST":
        try:
            username = request.json["username"]
            new_friend_list = memberTool.Search_member_by_username(username)
            response = {
                "ok": True,
                "data": new_friend_list
            }
            return jsonify(response), 200
        
        except Exception as error:
            print(f'Error in controller(friend) - Search_new_friend : {error}')
            response = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(response), 500

@friend_bp.route("/api/friend/add", methods = ["POST"])
def Add_friend():
    if request.method == "POST": 
        try:
            user_id = int(request.json["user_id"])
            friend_id = int(request.json["friend_id"])
            friendTool.Add_friend(user_id,friend_id)
            response = {
                "ok": True,
                "message": "success"
            }
            return jsonify(response), 200
        
        except Exception as error:
            print(f'Error in controller(friend) - Add_friend : {error}')
            response = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(response), 500
