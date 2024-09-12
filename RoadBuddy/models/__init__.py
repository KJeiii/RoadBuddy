import os
from dotenv import load_dotenv

load_dotenv()
# local for development
db_config = {
    "host": "localhost",
    "user": "root",
    "password": os.environ.get("dbpassword"),
    "database": "roadbuddy",
}

# AWS RDS
db_config = {
    "host": os.environ.get("db_host"),
    "port": os.environ.get("db_port"),
    "user": os.environ.get("db_user"),
    "password": os.environ.get("db_password"),
    "database": os.environ.get("database")
}