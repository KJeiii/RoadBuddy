from mysql.connector import pooling
from RoadBuddy.models import db_config
# from __init__ import db_config


class TeamTool(pooling.MySQLConnectionPool):
    def __init__(self):
        super().__init__(pool_name = "RoadBuddy",
                         pool_size = 3,
                         pool_reset_session = True,
                         **db_config)
        
    def Create_Team_table(self) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        create_string = ("create table team (" 
                         "team_id bigint primary key auto_increment, "
                         "team_name varchar(255) not null, "
                         "owner_id bigint not null, "
                         "foreign key(owner_id) references member(user_id))"
                         )
 
        cursor.execute(create_string)
        connection.close() 


    def Create_team(self, team_name:str, owner_id:int) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        create_string = ("insert into team (team_name, owner_id) "
                         "values (%s, %s)"
                         )
        data_string = (team_name, owner_id)

        cursor.execute(create_string, data_string)
        connection.commit()
        connection.close() 


    def Delete_team(self, team_name:str) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        delete_string = ("delete from team "
                         "where team_name = %s"
                         )
        data_string = (team_name, )

        cursor.execute(delete_string, data_string)
        connection.commit()
        connection.close() 


    def Search_team_by_teamname(self, team_name:str) -> list:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        search_string = ('select * from team '
                         'where team_name = %s'
                        )
        data_string = (team_name, )
                
        cursor.execute(search_string, data_string)
        result = cursor.fetchall()
        connection.close()

        return result
    

    def Search_created_team(self, owner_id:int) -> list:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        search_string = ('select * from team '
                         'where owner_id = %s'
                        )
        data_string = (owner_id, )
                
        cursor.execute(search_string, data_string)
        result = cursor.fetchall()
        connection.close()

        return result
    

    def Search_joined_team(self, user_id:int) -> list:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        search_string = ('select '
                         'team.team_name, '
                         'team.team_id, '
                         'team.owner_id '
                         'from team inner join partner '
                         'on team.team_id = partner.team_id '
                         'where partner_id = %s'
                        )
        data_string = (user_id, )
                
        cursor.execute(search_string, data_string)
        result = cursor.fetchall()
        connection.close()

        return result        
    

    def Create_partner_table(self) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        create_string = ("create table partner (" 
                         "id bigint primary key auto_increment, "
                         "team_id bigint not null, "
                         "partner_id bigint not null, "
                         "foreign key(team_id) references team(team_id), "
                         "foreign key(partner_id) references member(user_id)) "
                         )
 
        cursor.execute(create_string)
        connection.close() 


    def Add_partner(self, team_id:int, partner_id:list) -> None:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        add_string = ("insert into partner (team_id, partner_id) "
                      "values (%s, %s)"
                      )
        data_string = [(team_id, id) for id in partner_id]

        cursor.executemany(add_string, data_string)
        connection.commit()
        connection.close()      


    def Search_partner(self, team_id:int) ->list:
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)

        search_string = ("select "
                         "member.user_id, "
                         "member.username, "
                         "member.email "
                         "from partner inner join member "
                         "on partner.partner_id = member.user_id "
                         "where partner.team_id = %s"
                         )
        data_string = (team_id, )
                
        cursor.execute(search_string, data_string)
        result = cursor.fetchall()
        connection.close()

        return result
