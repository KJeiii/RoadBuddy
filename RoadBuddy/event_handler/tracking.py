from flask_socketio import emit
from RoadBuddy import socketio
import RoadBuddy.event_handler

@socketio.on("position")
def position(new_movement):
    sid = new_movement.get("sid")
    new_coordination = new_movement.get("coordination")
    team_id = new_movement.get("team_id")
    user_id = RoadBuddy.event_handler.online_users.get_user_id(sid)
    is_user_in_team = RoadBuddy.event_handler.online_users.get_user_information(user_id).get("team_id") == team_id
    
    if is_user_in_team:
        RoadBuddy.event_handler.online_teams.update_partner_coordination(
            team_id, sid, new_coordination.get("latitude"), new_coordination.get("longitude"))
        emit("movingPostion", RoadBuddy.event_handler.online_teams.get_all_partner_information(team_id), to=team_id)
    

