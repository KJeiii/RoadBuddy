from RoadBuddy.event_handler.util import Online_users

online_users = Online_users()

# user_info = {}
# sid_reference = {}
rooms_info = {}
own_coords = []
my_sid = None


# structure of dictionary

# user_info = {
#   user_id-1 (int) : {
#       sid: str,
#       username: str,
#       email: str,
#       team_id: str,
#       image_url: str,
#       coordination: [{latitude: , longitude: },{latitude: , longitude: }]
#   },
#   user_id-2 (int) : {
#       sid: str,
#       username: str,
#       email: str,
#       team_id: str,
#       image_url: str,
#       coordination: [{latitude: , longitude: },{latitude: , longitude: }]
#   }
# }


# sid_reference = {
#   sid-1 : user_id-1,
#   sid-2 : user_id-2,
# }


# rooms_info = {
#   room_id-1: {
#       "owner_sid": str,
#       "partners": {
#           sid-1 : {
#                   coordination: [{"latitude": XXX, "longitude": XXX},{"latitude": XXX, "longitude": XXX}],
#                   image_url: str
#                   }
#           sid-2 : {
#                   coordination: [{"latitude": XXX, "longitude": XXX},{"latitude": XXX, "longitude": XXX}],
#                   image_url: str
#                   }
#   },
#   room_id-2: {
#       "owner_sid": str,
#       "partners": {
#           sid-1 : {
#                   coordination: [{"latitude": XXX, "longitude": XXX},{"latitude": XXX, "longitude": XXX}],
#                   image_url: str
#                   }
#           sid-2 : {
#                   coordination: [{"latitude": XXX, "longitude": XXX},{"latitude": XXX, "longitude": XXX}],
#                   image_url: str
#                   }
#   }
#}