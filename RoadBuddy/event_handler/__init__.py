from RoadBuddy.event_handler.util import Online_users

online_users = Online_users()
rooms_info = {}
own_coords = []

# structure of dictionary
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