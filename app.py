from RoadBuddy import app
from RoadBuddy.views.routes import *
from RoadBuddy.controllers.member import member_bp
from RoadBuddy.controllers.friend import friend_bp
from RoadBuddy.controllers.team import team_bp
# from RoadBuddy.controllers.tracking import tracking_bp, rooms_info
from RoadBuddy.event_handler.connect import *
from RoadBuddy.event_handler.friend import *
from RoadBuddy.event_handler.team import *
from RoadBuddy.event_handler.tracking import *


app.register_blueprint(member_bp)
app.register_blueprint(friend_bp)
app.register_blueprint(team_bp)
# app.register_blueprint(tracking_bp)


socketio.run(app, debug=True, port=3000, allow_unsafe_werkzeug=True)
