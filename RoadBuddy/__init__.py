from flask import Flask
import os 
from dotenv import load_dotenv
from flask_socketio import SocketIO

load_dotenv()
app = Flask(__name__, 
            template_folder="./views/templates",
            static_folder="./views/static")

app.secret_key = "3b62657d32897eb69f59c089f0950dbe1ce4fd13"
app.json.ensure_ascii = False

socketio = SocketIO(app, 
                    # logger=True, 
                    cors_allowed_origins="*", 
                    ping_timeout=60,
                    ping_interval=5
                    )