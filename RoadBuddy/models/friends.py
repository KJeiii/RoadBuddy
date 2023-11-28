from mysql.connector import pooling
# from RoadBuddy.models import db_config
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
                         "id bigint primary key auto_increment, "
                         "user_id bigint not null, "
                         "friend_id bigint not null, "
                         "foreign key(user_id) references member(user_id),"
                         "foreign key(friend_id) references member(user_id))"
                         )
 
        cursor.execute(create_string)
        connection.close() 

    
    def Delete_table(self) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        create_string = ("drop table friends")
 
        cursor.execute(create_string)
        connection.close() 
        

    def Add_friend(self, user_id:int, friend_id:int) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        insert_string = ("insert into friends(user_id, friend_id) "
                         "values (%s, %s)"
                         )
        data_string = (user_id, friend_id)

        cursor.execute(insert_string, data_string)
        connection.commit()
        connection.close()


    def Delete_friend(self, user_id:int, friend_id:int) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        delete_string = ("delete from friends "
                         "where (user_id = %s and friend_id = %s) "
                         )
        data_string = (user_id, friend_id)

        cursor.execute(delete_string, data_string)
        connection.commit()
        connection.close()


    def Load_friends_list(self, user_id:int) -> list:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        search_string = ("select "
                 "member.user_id, member.username, member.email "
                 "from friends inner join member "
                 "on friends.friend_id = member.user_id "
                 "where friends.user_id = %s"
                 )
        data_string = (user_id,)
        
        cursor.execute(search_string, data_string)
        result = cursor.fetchall()
        connection.close()
        return result


test = FriendsTool()
test.Delete_friend(1,2)
