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

        
    def Search_member_by_email(self, email: str) -> list:
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
    

    def Search_member_by_username(self, username:str) -> list:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        search_string = ('select * from member '
                         'where username like %s'
                        )
        data_string = ("%" + username + "%", )
                
        cursor.execute(search_string, data_string)
        result = cursor.fetchall()
        connection.close()
        return result        
    

    def Search_member_by_id(self, user_id: int) -> list:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        search_string = ('select user_id, username, email from member '
                        'where user_id = %s'
                        )
        data_string = (user_id, )
                
        cursor.execute(search_string, data_string)
        result = cursor.fetchall()[0]
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


    def Update_basic_info(self, user_id: int, username: str, email: str, image: str):
        connection = self.get_connection()
        cursor = connection.cursor(dictionary = True)

        update_string = (
                        "update member "
                        "set username = if(username != %s, %s, username) "
                        "email = if(email != %s, %s , email) "
                        "image = %s "
                        "where user_id = %s"
                        )
        data_string = (username, username, email, email, image, user_id)

        cursor.execute(update_string, data_string)
        cursor.commit()
        connection.close()


    def Update_password(self, user_id: int, password:str):
        connection = self.get_connection()
        cursor = connection.cursor(dictionary = True)

        update_string = (
                        "update member "
                        "set password = %s "
                        "where user_id = %s"
                        )
        data_string = (password, user_id)

        cursor.execute(update_string, data_string)
        cursor.commit()
        connection.close()


# test = MemberTool()
# print(test.Search_member(email="123@mail"))

