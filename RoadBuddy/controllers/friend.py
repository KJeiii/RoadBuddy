from flask import Blueprint, render_template, request, jsonify
from RoadBuddy.models import friends

friendsTool = friends.FriendsTool()
friends_bp = Blueprint("friends_bp",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

# Signup
@friends_bp.route("/api/friends", methods = ["POST"])
def Load_friends_list():
    user_id = request.json["user_id"]
    