from mysql.connector import pooling
from RoadBuddy.models import db_config
# from __init__ import db_config


class TeamTool(pooling.MySQLConnectionPool):
    def __init__(self):
        super().__init__(pool_name = "RoadBuddy",
                         pool_size = 10,
                         pool_reset_session = True,
                         **db_config)
        
    def Create_table(self) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        create_string = ("create table friends (" 
                         "id bigint primary key auto_increment, "
                         "user_id bigint not null, "
                         "friend_id bigint not null, "
                         "foreign key(user_id) references member(user_id),"
                         "foreign key(friend_id) references member(user_id))"
                         )
 
        cursor.execute(create_string)
        connection.close() 
