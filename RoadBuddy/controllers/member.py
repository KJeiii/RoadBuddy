from flask import Blueprint, render_template, request, jsonify
from RoadBuddy.models import member
from werkzeug.security import generate_password_hash, check_password_hash
import datetime as dt
import jwt, os

memberTool = member.MemberTool()
member_bp = Blueprint("member_bp",
                      __name__,
                      template_folder="templates",
                      static_folder="static")

# Signup
@member_bp.route("/api/member", methods = ["POST"])
def Signup():
    if request.method == "POST":
        try:
            email = request.json.email
            if len(memberTool.Search_member(email)) != 0 :
                response = {
                    "error": True,
                    "message": "註冊失敗，電子信箱重覆"
                }
                return jsonify(response), 400

            username = request.json.username
            password = generate_password_hash(request.json.password)
            memberTool.Add_member(username, email, password)

            response = {
                 "ok": True
            }
            return jsonify(response), 200

        except Exception as error:
            print(error)
            response = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(response), 500
        
# signin and check user status
@member_bp.route("/api/member/auth", methods = ["PUT"])
def Signin():
    # signin
    if request.method == "PUT":
        try:
            email = request.json.email
            if len(memberTool.Search_member(email)) == 0:
                response = {
                    "error": True,
                    "message": "登入失敗，此電子信件尚未註冊"
                }
                return jsonify(response), 400
            
            member_info = memberTool.Search_member(email)[0]
            if check_password_hash(member_info.password, request.json.password):
                username = request.json.username
                jwt_payload = {
                    "usi": member_info.user_id,
                    "usn": member_info.username,
                    "eml": member_info.email,
                    "exp" : dt.datetime.utcnow() + dt.timedelta(days=7)
                } 

                JWT = jwt.encode(jwt_payload, os.environ.get("jwtsecret"))
                response = {
                    "token": JWT
                }
                return jsonify(response), 200
            else:
                response = {
                    "error": True,
                    "message": "登入失敗，密碼不正確"
                }
                return jsonify(response), 400
        
        except Exception as error:
            print(error)
            response = {
                "error": True,
                "message": "伺服器內部錯誤"
            }
            return jsonify(response), 500
    
    # check user status
    if request.method == "GET":
        try:
            JWT_in_headers = request.headers.get("authorization").split(" ")
            if "Bearer" in JWT_in_headers:
                JWT = JWT_in_headers[1]
                jwt_payload = jwt.decode(JWT, os.environ.get("jwtsecret"))
                response = {
                    "user_id": jwt_payload.usi,
                    "username": jwt_payload.usn,
                    "email": jwt_payload.eml
                }
                return jsonify(response), 200
        
        except Exception as error:
            print(f"Error in signin(GET) : {error}")
            response = {
                "data": None
            }
            return jsonify(response), 200

