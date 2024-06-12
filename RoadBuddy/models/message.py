from mysql.connector import pooling
from RoadBuddy.models import db_config
# from __init__ import db_config


class MessageTool(pooling.MySQLConnectionPool):
    def __init__(self):
        super().__init__(pool_name = "RoadBuddy",
                         pool_size = 10,
                         pool_reset_session = True,
                         **db_config)
        
    def Create_Message_table(self) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        create_string = ("create table message ("
                         "message_id bigint primary key auto_increment, " 
                         "user_id bigint not null, "
                         "from_user_id bigint not null, "
                         "foreign key(user_id) references member(user_id), "
                         "foreign key(from_user_id) references member(user_id))"
                         )
 
        cursor.execute(create_string)
        connection.close() 


    def Create_message(self, user_id:int, from_user_id:int) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        create_string = ("insert into message (user_id, from_user_id) "
                         "values (%s, %s)"
                         )
        data_string = (user_id, from_user_id)

        cursor.execute(create_string, data_string)
        connection.commit()
        connection.close() 


    def Delete_message(self, user_id:int, from_user_id:int) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        delete_string = ("delete from message "
                         "where (user_id = %s and from_user_id = %s)"
                         )
        data_string = (user_id, from_user_id)

        cursor.execute(delete_string, data_string)
        connection.commit()
        connection.close() 


    def Search_message(self, user_id:int) -> list:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        search_string = ('select message.from_user_id, member.username from message '
                         'inner join member on message.from_user_id = member.user_id '
                         'where message.user_id = %s'
                        )
        data_string = (user_id, )
                
        cursor.execute(search_string, data_string)
        result = cursor.fetchall()
        connection.close()
        return result
    
if __name__ == "__main__":
    test = MessageTool()
    test.Create_Message_table()
