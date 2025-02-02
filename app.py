from RoadBuddy import app
from RoadBuddy.views.routes import *
from RoadBuddy.controllers.member import member_bp
from RoadBuddy.controllers.friend import friend_bp
from RoadBuddy.controllers.team import team_bp
from RoadBuddy.controllers.message import message_bp
from RoadBuddy.event_handler.connect import *
from RoadBuddy.event_handler.friend import *
from RoadBuddy.event_handler.team import *
from RoadBuddy.event_handler.tracking import *
import dotenv

dotenv.load_dotenv()
app.register_blueprint(member_bp)
app.register_blueprint(friend_bp)
app.register_blueprint(team_bp)
app.register_blueprint(message_bp)

socketio.run(app, debug=True, host="0.0.0.0", port=3000, allow_unsafe_werkzeug=True)
