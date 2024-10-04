from flask import Blueprint, render_template, request, jsonify
from RoadBuddy.models import friend, member
import RoadBuddy.event_handler

friendTool = friend.FriendTool()
memberTool = member.MemberTool()

friend_bp = Blueprint("friend_bp",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

@friend_bp.route("/api/friend/<user_id>", methods = ["GET"])
def Search_old_friend(user_id: int):
    if request.method == "GET": 
        try:
            user_id = int(user_id)
            friend_list = friendTool.Load_friend_list(user_id)
            RoadBuddy.event_handler.online_users.update_user_information(user_id, friend_list = friend_list)
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
    
@friend_bp.route("/api/friend", methods = ["GET"])
def Search_new_friend():
    if request.method == "GET":
        try:
            new_friend_list = memberTool.Search_member_by_username(request.args.get("searchName"))
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
            user_name = memberTool.Search_member_by_id(user_id).get("username")
            friend_id = int(request.json["friend_id"])
            friend_name = memberTool.Search_member_by_id(friend_id).get("username")
            friendTool.Add_friend(user_id,friend_id)
            RoadBuddy.event_handler.online_users.update_friend_list(user_id, user_name, friend_id, friend_name)
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
