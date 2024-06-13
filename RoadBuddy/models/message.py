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
                         "receiver_id bigint not null, "
                         "sender_id bigint not null, "
                         "foreign key(receiver_id) references member(user_id), "
                         "foreign key(sender_id) references member(user_id))"
                         )
 
        cursor.execute(create_string)
        connection.close() 


    def Create_message(self, receiver_id:int, sender_id:int) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        create_string = ("insert into message (receiver_id, sender_id) "
                         "values (%s, %s)"
                         )
        data_string = (receiver_id, sender_id)

        cursor.execute(create_string, data_string)
        connection.commit()
        connection.close() 


    def Delete_message(self, receiver_id:int, sender_id:int) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        delete_string = ("delete from message "
                         "where (receiver_id = %s and sender_id = %s)"
                         )
        data_string = (receiver_id, sender_id)

        cursor.execute(delete_string, data_string)
        connection.commit()
        connection.close() 


    def Search_message(self, user_id:int) -> list:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        search_string = ('select message.message_id, message.sender_id, sender.username as sender_name, '
                        'message.receiver_id, receiver.username as receiver_name '
                        'from message '
                        'inner join member sender on message.sender_id = sender.user_id '
                        'inner join member receiver on message.receiver_id = receiver.user_id '
                        'where message.receiver_id = %s or message.sender_id = %s'
                        )
        data_string = (user_id, user_id)
    
        cursor.execute(search_string, data_string)
        result = cursor.fetchall()
        connection.close()
        return result
   
if __name__ == "__main__":
    test = MessageTool()
    test.Create_Message_table()
