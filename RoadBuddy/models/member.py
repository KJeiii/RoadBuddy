from mysql.connector import pooling
from RoadBuddy.models import db_config
# from __init__ import db_config


class MemberTool(pooling.MySQLConnectionPool):
    def __init__(self):
        super().__init__(pool_name = "RoadBuddy",
                         pool_size = 10,
                         pool_reset_session = True,
                         **db_config)
        
    def Create_database(self) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        create_string = ("create database roadbuddy")
        cursor.execute(create_string)
        connection.close()


    def Create_table(self) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        create_string = ("create table member (" 
                         "user_id bigint primary key auto_increment, "
                         "username varchar(255) not null, "
                         "email longtext not null, "
                         "password longtext not null)"
                         )
 
        cursor.execute(create_string)
        connection.close()       

        
    def Search_member(self, email: str) -> list:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        search_string = ('select * from member '
                         'where email = %s'
                        )
        data_string = (email, )
                
        cursor.execute(search_string, data_string)
        result = cursor.fetchall()
        connection.close()

        return result

        
    def Add_member(self, username: str, email: str, password: str) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        update_string = (
                        "insert into member (username, email, password)"
                        "values (%s, %s, %s)"
                        )
        data_string = (username, email, password)
                    
        cursor.execute(update_string, data_string)
        connection.commit()
        connection.close()


# test = MemberTool()
# print(test.Search_member(email="123@mail"))

