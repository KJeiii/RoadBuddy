from flask import Flask
import os 
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, 
            template_folder="./views/templates",
            static_folder="./views/static")

app.secret_key = "3b62657d32897eb69f59c089f0950dbe1ce4fd13"