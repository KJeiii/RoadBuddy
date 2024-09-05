class Online_users:
    def __init__(self):
        pass
    users_category = {}
    '''
    user_id : {
        "sid": str,
        "username": str,
        "email": str,
        "team_id": str,
        "friend_list": list,
        "message_list": list
    }
    '''
    sid_category = {}
    '''
    request.sid (str) : user_id (int)
    '''
    
    def append_user_information(
        self, user_id: int, username: str, email: str,
        team_id: str = None, friend_list: list = None, 
        message_list: list = None, sid: str = None) -> None:
        self.users_category[user_id] = {
            "username": username,
            "email": email,
            "team_id": team_id,
            "sid": sid,
            "friend_list": friend_list,
            "message_list": message_list
        }

    def remove_user(self, user_sid:str) -> None:
        user_id = self.sid_category.get(user_sid)
        del self.users_category[user_id]
        del self.sid_category[user_sid]

    def update_user_information(self, user_id:int, **update_information) -> None:
        for item in update_information:
            self.users_category[user_id][item] = update_information[item]

    def get_all_users_information(self) -> dict:
        return self.users_category
    
    def get_all_users_sid(self) -> dict:
        return self.sid_category
    
    def get_user_information(self, user_id:str) -> dict:
        return self.users_category.get(user_id)
    
    def get_user_id(self, user_sid:str) -> int:
        return self.sid_category.get(user_sid)
    
    def get_user_sid(self, user_id: int) -> str:
        return self.users_category.get(user_id).get("sid")
    
    def get_all_users_id(self) -> list:
        return list(self.users_category.keys())
    
    def update_friend_list(self, user_id:int, user_name:str, friend_id:int, friend_name: str) -> None:
        self.users_category[user_id]["friend_list"].append({"user_id":friend_id, "username": friend_name})
        self.users_category[friend_id]["friend_list"].append({"user_id":user_id, "username": user_name})

    def update_team_id(self, user_id: int, team_id: str) -> None:
        self.users_category[user_id]["team_id"] = team_id
    
    def append_user_sid(self, user_sid: str, user_id: int = None) -> None:
        self.sid_category[user_sid] = user_id

    def update_user_sid_category(self, user_sid: str, user_id: int) -> None:
        self.sid_category[user_sid] = user_id

    def is_user_online(self, user_id: int) -> bool:
        return user_id in self.users_category.keys()
    
    def is_user_traveling(self, user_id: int) -> bool:
        if self.is_user_online(user_id):
            return self.get_user_information(user_id).get("team_id") != None
        return False

