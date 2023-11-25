from mysql.connector import pooling
from __init__ import db_config


class FriendsTool(pooling.MySQLConnectionPool):
    def __init__(self):
        super().__init__(pool_name = "RoadBuddy",
                         pool_size = 10,
                         pool_reset_session = True,
                         **db_config)
        
    def Create_table(self) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        create_string = ("create table friends (" 
                         "user_id bigint primary key auto_increment, "
                         "friend_id bigint not null, "
                         "foreign key(friend_id) references member(user_id))"
                         )
 
        cursor.execute(create_string)
        connection.close() 
        

    def Add_friend(self, username:str) -> None:
        pass


    def Search_friends(self, username:str) -> list:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        search_string = ("select  from ")
        pass

# test = FriendsTool().Create_table()

    