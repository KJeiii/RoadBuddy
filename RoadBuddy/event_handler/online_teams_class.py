class Online_teams:
    def __init__(self) -> None:
        pass
    team_category = {}
    '''
    team_category = {
      room_id-1 (str): {
          "owner_sid": str,
          "partners": {
              sid-1 (str) : {
                        "user_id": int,
                        "username": str,
                        "image_url": str,
                        "icon_color": str,
                        "coordination": {"latitude": float, "longitude": float},
                      }
              sid-2 (str) : { same structure as sid-1 }
      },
      room_id-2 (str): { same structure as room_id-1 }
    '''
    def is_team_online(self, team_id: str) -> bool:
        return team_id in self.team_category.keys()

    def check_team_online(self, callback_function) -> None:
        print(self, callback_function)
        def check_function(*arg, **karg) -> None:
            team_id = arg[0]
            if self.is_team_online(team_id):
                callback_function(*arg, **karg)
                return
            if not self.is_team_online(team_id) and callback_function.__name__ == "append_team":
                callback_function(*arg, **karg)
                return
        return check_function
    
    def append_partner(self, team_id: str, sid: str, user_id: int, username: str,
                       image_url: str, icon_color: str, coordination: dict) -> None:
        if self.is_team_online(team_id):
            self.team_category[team_id]["partners"].update(
                {sid: {
                    "user_id": user_id,
                    "username": username,
                    "image_url": image_url,
                    "icon_color": icon_color,
                    "coordination": coordination}
                }
            )
    
    def remove_partner(self, team_id: str, partner_sid: str) -> None:
        if self.is_team_online(team_id):
            del self.team_category[team_id]["partners"][partner_sid]

    def get_partner_amount(self, team_id: str) -> int:
        if self.is_team_online(team_id):
            return len(self.team_category[team_id]["partners"].keys())

    def append_team(self, team_id: str, owner_sid: str) -> None:
        if not self.is_team_online(team_id):
            self.team_category.update(
                {team_id: {
                    "owner_sid": owner_sid,
                    "partners": {}
                }}
            )

    def remove_team(self, team_id: str) -> None:
        if self.is_team_online(team_id) and self.get_partner_amount(team_id) <= 0:
            del self.team_category[team_id]

    def get_all_team_ids(self) -> list:
        return list(self.team_category.keys())
    
    def get_team_owner_sid(self, team_id: str) -> str:
        if self.is_team_online(team_id):
            return self.team_category.get(team_id).get("owner_sid")
    
    def get_all_partner_information(self, team_id: str) -> dict:
        if self.is_team_online(team_id):
            return self.team_category.get(team_id).get("partners")
    
    def update_partner_coordination(self, team_id: str, user_sid: str, latitude: float, longitude: float) -> None:
          if self.is_team_online(team_id) and\
            user_sid in self.team_category.get(team_id).get("partners").keys():
            self.team_category[team_id]["partners"][user_sid]["coordination"].update(
                    {"latitude": latitude, "longitude": longitude}
            )