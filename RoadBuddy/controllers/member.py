from flask import Blueprint, render_template, request, jsonify
from RoadBuddy.models import member
import RoadBuddy.event_handler
from werkzeug.security import generate_password_hash, check_password_hash
import datetime as dt
import jwt, os
import RoadBuddy.models.AWS_S3

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
            email = request.json["email"]
            if len(memberTool.Search_member_by_email(email)) != 0 :
                response = {
                    "error": True,
                    "message": "註冊失敗，電子信箱重覆"
                }
                return jsonify(response), 400
            username = request.json["username"]
            password = generate_password_hash(request.json["password"])
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

def Decode_JWT_Token(JWT_token: str) -> dict:
    jwt_payload = jwt.decode(JWT_token, os.environ.get("jwtsecret"),"HS256")
    user_id = jwt_payload["usi"]
    username = jwt_payload["usn"]
    email = jwt_payload["eml"]
    return {"user_id": user_id, "username": username, "email": email}

# signin and check user status
@member_bp.route("/api/member/auth", methods = ["PUT", "GET"])
def Login():
    # signin
    if request.method == "PUT":
        try:
            email = request.json["email"]
            if len(memberTool.Search_member_by_email(email)) == 0:
                response = {
                    "error": True,
                    "message": "此電子信件尚未註冊"
                }
                return jsonify(response), 400
            
            member_info = memberTool.Search_member_by_email(email)[0]
            if check_password_hash(member_info["password"], request.json["password"]):
                jwt_payload = {
                    "usi": member_info["user_id"],
                    "usn": member_info["username"],
                    "eml": member_info["email"],
                    "exp" : dt.datetime.utcnow() + dt.timedelta(days=7)
                } 

                JWT = jwt.encode(jwt_payload, os.environ.get("jwtsecret"),)
                response = {
                    "token": JWT
                }
                return jsonify(response), 200
            else:
                response = {
                    "error": True,
                    "message": "密碼不正確"
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
                user_id, username, email = Decode_JWT_Token(JWT_in_headers[1]).values()
                # JWT = JWT_in_headers[1]
                # jwt_payload = jwt.decode(JWT, os.environ.get("jwtsecret"),"HS256")
                # user_id = jwt_payload["usi"]
                # username = jwt_payload["usn"]
                # email = jwt_payload["eml"]

                RoadBuddy.event_handler.sid_reference[RoadBuddy.event_handler.my_sid] = user_id
                RoadBuddy.event_handler.user_info[user_id] = {
                    "sid": RoadBuddy.event_handler.my_sid,
                    "username": username,
                    "email": email,
                    "team_id": None,
                    "messages": []
                }
                
                response = {
                    "user_id": user_id,
                    "username": username,
                    "email": email
                }
                return jsonify(response), 200
        
        except Exception as error:
            print(f"Error in signin(GET) : {error}")
            response = {
                "data": None
            }
            return jsonify(response), 200


# update user information - avatar and username
def allow_upload(filename: str) -> bool:
    allow_extensions = ["jpg", "jpeg", "png"]
    file_extension = filename.split(".")[-1]
    return "." in filename and file_extension in allow_extensions

@member_bp.route("/api/member/update/basic", methods = ["PATCH"])
def update_basic_info():
    if request.method == "PATCH":   
        try: 
            JWT_in_headers = request.headers.get("authorization").split(" ")
            if "Bearer" in JWT_in_headers:
                user_id, username, email = Decode_JWT_Token(JWT_in_headers[1]).values()

            # check if there are new information
            has_new_username = request.form.get("username_to_update") != username
            has_new_avatar = request.files.get("avatar") != None
            if not has_new_avatar and not has_new_username:
                response = {"ok": True, "message": "There is no information to update."}
                return jsonify(response), 200

            # create username_to_update
            username_to_update = request.form.get("username_to_update") if has_new_username else username

            # create image_url_to_update
            image_url_to_update = ""                    
            if has_new_avatar:       
                if not allow_upload(request.files.get("avatar").filename):
                    response = {
                        "error": True,
                        "message": "File format is unacceptable; only jpg, jpeg, png are available."
                    }
                    return jsonify(response), 422
                else: 
                    new_avatar = request.files.get("avatar")
                    avatar_extension = request.files.get("avatar").filename.split(".")[-1]
                    new_filename = "roadbuddy_avatar_" + \
                                    user_id + "_" + \
                                    email + \
                                    avatar_extension
                
                # File uploaded with name already used in bucket will overwrite the old one.
                RoadBuddy.models.AWS_S3.Upload_file(new_avatar, new_filename)

                # update image_url
                # RDS_domain_name = "https://d3esmkykp2s2l5.cloudfront.net/"
                image_url_to_update = os.getenv("RDS_domain_name") + new_filename

            # update RDS
            memberTool.Update_basic_info(
                user_id = request.json["user_id"],
                username_to_update = username_to_update,
                image_url_to_update = image_url_to_update
            )
            return jsonify({"ok": True}), 200
        
        except Exception as error:
            print("Failed to update basic information: ", error)
            response = {"error": True, "message": "伺服器內部錯誤"}
            return jsonify(response), 500


# update user password
def allow_change_password(email, password):
    return check_password_hash(memberTool.Search_member_by_email(email)[0]["password"], password)

@member_bp.route("/api/member/update/pwd", methods = ["PUT"])
def update_password():
    if request.method == "PUT":
        JWT_in_headers = request.headers.get("authorization").split(" ")
        if "Bearer" in JWT_in_headers:
            user_id, username, email = Decode_JWT_Token(JWT_in_headers[1]).values()

        try:
            if not allow_change_password(email = email, password = request.json.get("pwd_in_use")):
                response = {"error": True, "message": "The password in use is incorrect."}
                return jsonify(response), 403
            else:
                new_password_hashed = generate_password_hash(request.json.get("pwd_to_update"))
                memberTool.Update_password(user_id = user_id, password = new_password_hashed)
                return jsonify({"ok": True}), 200
        except Exception as error:
            print(error)
            response = {"error": True, "message": "伺服器內部錯誤"}
            return jsonify(response), 500

#testing
@member_bp.route("/api/member/update/test", methods = ["PATCH"])
def test_file_upload():
    if request.method == "PATCH":
        print(dir(os.environ))
        print((os.environ))
        image_file = request.files["avatar"]
        print("request files", request.files)
        print("request form", request.form)
        return jsonify({"ok": True}), 200





