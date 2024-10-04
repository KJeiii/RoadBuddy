from flask import Blueprint, request, jsonify
from RoadBuddy.models.message import MessageTool

MessageTool = MessageTool()
message_bp = Blueprint("message",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

@message_bp.route("/api/message", methods = ["GET", "POST", "DELETE"])
def message():
    if request.method == "POST":
        try:
            receiver_id_list = request.json["receiverIDArray"]
            sender_id = int(request.json["senderID"])
            MessageTool.Create_message(sender_id, receiver_id_list)
            return jsonify({"ok": True}), 200
        except Exception as error:
            print(f'Error in controller(message) - (POST method) : {error}')
            return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500
        
    if request.method == "GET": 
        try:  
            user_id = int(request.args.get("userID"))
            messages = MessageTool.Search_message(user_id)
            return jsonify({"ok": True, "data": messages}), 200
        except Exception as error:
            print(f'Error in controller(message) - (PATCH method) : {error}')
            return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500
        
    if request.method == "DELETE":
        try:
            MessageTool.Delete_message(int(request.json["sender_id"]), int(request.json["receiver_id"]))
            return jsonify({"ok": True}), 200
        except Exception as error:
            print(f'Error in controller(message) - (DELETE method) : {error}')
            return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500
        
    
    