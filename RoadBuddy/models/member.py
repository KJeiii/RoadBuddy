from mysql.connector import pooling
from RoadBuddy.models import db_config
# from __init__ import db_config


class MemberTool(pooling.MySQLConnectionPool):
    def __init__(self):
        super().__init__(pool_name = "RoadBuddy",
                         pool_size = 5,
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
                         "password longtext not null, "
                         "image_url longtext)"
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

        search_string = ('select user_id, email, username, image_url from member '
                        'where user_id = %s'
                        )
        data_string = (user_id, )
                
        cursor.execute(search_string, data_string)
        result = cursor.fetchall()[0]
        connection.close()
        return result    

        
    def Add_member(self, username: str, email: str, password: str, image_url: str = None) -> None:
        print(image_url)
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        update_string = (
                        "insert into member (username, email, password, image_url)"
                        "values (%s, %s, %s, %s)"
                        )
        data_string = (username, email, password, image_url)
                    
        cursor.execute(update_string, data_string)
        connection.commit()
        connection.close()


    def Update_basic_info(self, user_id: int, username_to_update: str, image_url_to_update: str):
        connection = self.get_connection()
        cursor = connection.cursor(dictionary = True)

        update_string = (
                        "update member "
                        "set username = if(username != %s, %s, username), "
                        "image_url = %s "
                        "where user_id = %s"
                        )\
                        if image_url_to_update != "" else\
                        (
                        "update member "
                        "set username = if(username != %s, %s, username) "
                        "where user_id = %s"
                        )
        data_string = (
                       username_to_update, username_to_update, 
                       image_url_to_update, user_id
                       ) \
                        if image_url_to_update != "" else\
                       (
                       username_to_update, username_to_update, 
                       user_id
                       )

        cursor.execute(update_string, data_string)
        connection.commit()
        connection.close()


    def Update_password(self, user_id: int, password_to_update:str):
        connection = self.get_connection()
        cursor = connection.cursor(dictionary = True)

        update_string = (
                        "update member "
                        "set password = %s "
                        "where user_id = %s"
                        )
        data_string = (password_to_update, user_id)

        cursor.execute(update_string, data_string)
        connection.commit()
        connection.close()



