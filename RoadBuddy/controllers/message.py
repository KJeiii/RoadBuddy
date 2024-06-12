from flask import Flask, Blueprint, request, jsonify
from RoadBuddy.models.message import MessageTool

MessageTool = MessageTool()
message_bp = Blueprint("message",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

@message_bp.route("/api/message", methods = ["PATCH", "POST", "DELETE"])
def message():
    if request.method == "POST":
        try:
            MessageTool.Create_message(int(request.json["user_id"]), int(request.json["from_user_id"]))
            return jsonify({"ok": True}), 200
        except Exception as error:
            print(f'Error in controller(message) - (POST method) : {error}')
            return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500

    if request.method == "PATCH":
        try:   
            messages = MessageTool.Search_message(int(request.json["user_id"]))
            return jsonify({"ok": True, "data": messages}), 200
        except Exception as error:
            print(f'Error in controller(message) - (PATCH method) : {error}')
            return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500
        
    if request.method == "DELETE":
        try:
            MessageTool.Delete_message(int(request.json["user_id"]), int(request.json["from_user_id"]))
            return jsonify({"ok": True}), 200
        except Exception as error:
            print(f'Error in controller(message) - (DELETE method) : {error}')
            return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500
        
    
    