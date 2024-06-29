user_info = {}
sid_reference = {}
rooms_info = {}
own_coords = []
my_sid = None


# structure of dictionary

# user_info = {
#   user_id-1 (int) : {
#       sid: XXX,
#       username: XXX,
#       email: XXX,
#       team_id: XXX (str),
#   },
#   user_id-2 (int) : {
#       sid: XXX,
#       username: XXX,
#       email: XXX,
#       team_id:XXX (str)
#   }
# }


# sid_reference = {
#   sid-1 : user_id-1,
#   sid-2 : user_id-2,
# }


# rooms_info = {
#   room_id-1: {
#       sid-1 : [{
#                 "latitude": XXX, 
#                 "longitude": XXX
#                },
#                {
#                 "latitude": XXX, 
#                 "longitude": XXX
#                }],
#       sid-2 : [{
#                 "latitude": XXX, 
#                 "longitude": XXX
#                },
#                {
#                 "latitude": XXX, 
#                 "longitude": XXX
#                }]
#       },
#   room_id-2: {
#       sid-1 : [{
#                 "latitude": XXX, 
#                 "longitude": XXX
#                },
#                {
#                 "latitude": XXX, 
#                 "longitude": XXX
#                }],
#       sid-2 : [{
#                 "latitude": XXX, 
#                 "longitude": XXX
#                },
#                {
#                 "latitude": XXX, 
#                 "longitude": XXX
#                }]
#       },